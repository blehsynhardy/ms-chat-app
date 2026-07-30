import { errorHandler } from "@/middleware/error-handler";
import { registerRoutes } from "@/routes/index";
import { createInternalAuthMiddleware } from "@chatapp/common";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import { env } from "@/config/env";

export const createApp = (): Application => {
  const app: Application = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(createInternalAuthMiddleware(env.INTERNAL_AUTH_TOKEN));

  registerRoutes(app);

  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.use(errorHandler);

  return app;
};
