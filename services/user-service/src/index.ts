import { createApp } from "@/app";
import { env } from "@/config/env";
import { initializeDatabase } from "@/db/sequelize";
import { startAuthEventConsumer } from "@/messaging/auth-consumer";
import { logger } from "@/utils/logger";
import { createServer } from "http";
const main = async () => {
  try {
    await initializeDatabase();
    await startAuthEventConsumer();
    const app = createApp();
    const server = createServer(app);

    const PORT = env.USER_SERVICE_PORT || 4001;

    server.listen(PORT, () => {
      logger.info(`${PORT}: User service is running on port`);
    });

    const shutdown = () => {
      logger.info("Shutting down User service...");
      Promise.all([])
        .catch((error) => {
          logger.error(error, "Error during shutdown");
        })
        .finally(() => {
          server.close(() => {
            logger.info("User service has been shut down");
            process.exit(0);
          });
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error(error, "Error starting user service");
    process.exit(1);
  }
};

main();
