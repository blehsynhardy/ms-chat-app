import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.USER_DB_URL, {
  dialect: "postgres",
  logging:
    env.NODE_ENV === "development"
      ? (msg: unknown) => logger.debug(msg)
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

const connectToDatabase = async () => {
  await sequelize.authenticate();
  logger.info("User Database connection established successfully.");
};

export const initializeDatabase = async () => {
  await connectToDatabase();
  const syncOption = env.NODE_ENV === "development" ? {} : { alter: true };
  await sequelize.sync(syncOption);
  logger.info("User database synchronized");
};

export const disconnectFromDatabase = async () => {
  await sequelize.close();
  logger.info(" User Database connection closed successfully.");
};
