import type { Logger } from "@chatapp/common";
import { createLogger } from "@chatapp/common";

export const logger: Logger = createLogger({
  name: "user-service",
  level: process.env.LOG_LEVEL || "info",
});
