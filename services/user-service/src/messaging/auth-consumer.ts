import {
  connect,
  type Channel,
  type ChannelModel,
  type Connection,
  type ConsumeMessage,
  type Replies,
} from "amqplib";

import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  type AuthRegisteredEvent,
} from "@chatapp/common";

import { env } from "@/config/env";
import { userService } from "@/services/user.services";
import { logger } from "@/utils/logger";

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let consumerTag: string | null = null;
let channel: Channel | null = null;

const QUEUE_NAME = "auth-service.auth-events";

const closeConnection = async (conn: ManageConnection) => {
  await conn.close();
  connectionRef = null;
  channel = null;
  consumerTag = null;
};

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString("utf-8");
  const event = JSON.parse(raw) as AuthRegisteredEvent;

  await userService.syncFromAuthUser(event.payload);

  ch.ack(message);
};

export const startAuthEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn("RABBITMQ URL is not configured, skip");
    return;
  }
  if (channel) {
    return;
  }
  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(AUTH_EVENT_EXCHANGE, "topic", { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
  await ch.bindQueue(
    queue.queue,
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_ROUTING_KEY,
  );

  const consumerHandler = (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    void handleMessage(msg, ch).catch((error: unknown) => {
      logger.error({ err: error }, "Failed to process auth event");
      ch.nack(msg, false, false);
    });
  };

  const result: Replies.Consume = await ch.consume(
    queue.queue,
    consumerHandler,
  );
  consumerTag = result.consumerTag;

  connection.on("close", () => {
    logger.warn("Auth Consumer close");
    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  connection.on("error", (error) => {
    logger.error({ err: error }, "Auth consumer connection error");
  });

  logger.info("Auth Event consumer started");
};

export const stopAuthEventConsumer = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag);
      consumerTag = null;
    }

    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connectionRef;
    if (conn) {
      await closeConnection(conn);
      connectionRef = null;
    }

  } catch (error) {
    logger.error({err : error}, 'Failed to stop Auth consumer');
  }
};
