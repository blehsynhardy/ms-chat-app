import { HttpError } from "@chatapp/common";

import { logger } from "@/utils/logger";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({ err }, "Unhandled error occurred in the application");

  const error = err instanceof HttpError ? err : undefined;
  const statusCode = error?.statusCode ?? 500;
  const message =
    statusCode >= 500
      ? "Internal server error"
      : (error?.message ?? "Unknown error");
  const payload = error?.details
    ? { message, details: error.details }
    : { message };

  res.status(statusCode).json(payload);

  void next();
};
