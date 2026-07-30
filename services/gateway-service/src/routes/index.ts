import type { Router } from "express";

import { authRouter } from "@/routes/auth.route";

export const registerRoute = (app: Router) => {
  app.use("/auth", authRouter);
};
