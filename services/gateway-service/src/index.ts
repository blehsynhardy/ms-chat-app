import { createApp } from "@/app";
import { env } from "@/config/env";

import { logger } from "@/utils/logger";
import { createServer } from "http";
const main = async () => {
  try {

    const app = createApp();
    const server = createServer(app);

    const PORT = env.GATEWAY_PORT || 4000;

    server.listen(PORT, () => {
      logger.info(`${PORT}: Gateway service is running on port`);
    });

    const shutdown = () => {
      logger.info("Shutting down Gateway service...");
      Promise.all([])
        .catch((error) => {
          logger.error(error, "Error during shutdown");
        })
        .finally(() => {
          server.close(() => {
            logger.info("Gateway service has been shut down");
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
