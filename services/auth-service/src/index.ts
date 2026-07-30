import { createApp } from "@/app";
import { env } from "@/config/env";
import { connectToDatabase, disconnectFromDatabase } from "@/db/sequelize";
import { closePublisher, initPublisher } from "@/messaging/event-publishing";
import { initModel } from "@/model";
import { logger } from "@/utils/logger";
import { createServer } from "http";
const main = async () => {
  try {
    await connectToDatabase();
    await initModel();
    await initPublisher();
    const app = createApp();
    const server = createServer(app);

    const PORT = env.AUTH_SERVICE_PORT || 4003;

    server.listen(PORT, () => {
      logger.info(`${PORT}: Auth service is running on port`);
    });

    const shutdown = () => {
      logger.info("Shutting down auth service...");
      Promise.all([disconnectFromDatabase(), closePublisher()])
        .catch((error: unknown) => {
          logger.error({ error }, "Error during shutdown");
        })
        .finally(() => {
          server.close(() => {
            logger.info("Auth service has been shut down");
            process.exit(0);
          });
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error(error, "Error starting auth service");
    process.exit(1);
  }
};

main();
