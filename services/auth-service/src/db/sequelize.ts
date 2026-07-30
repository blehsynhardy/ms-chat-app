import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.AUTH_DB_URL, {
  dialect: "mysql",
  logging:
    env.NODE_ENV === "development"
      ? (msg: unknown) => logger.debug(msg)
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});


export const connectToDatabase = async () => {
    await sequelize.authenticate();
    logger.info("Database connection established successfully.");
  }

  export const disconnectFromDatabase = async () => {
    await sequelize.close();
    logger.info("Database connection closed successfully.");
  }
  
