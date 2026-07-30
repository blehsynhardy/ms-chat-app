import {
  loginHandler,
  refreshHandler,
  registerHandler,
  revokeHandler,
} from "@/controller/auth.controller";
import { validateRequest } from "@chatapp/common";
import { Router } from "express";
import {
  loginScehma,
  refreshScehma,
  registerScehma,
  revokeScehma,
} from "./auth.schema";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({ body: registerScehma.shape.body }),
  registerHandler,
);

authRouter.post(
  "/login",
  validateRequest({ body: loginScehma.shape.body }),
  loginHandler,
);
authRouter.post(
  "/refresh",
  validateRequest({ body: refreshScehma.shape.body }),
  refreshHandler,
);
authRouter.post(
  "/revoke",
  validateRequest({ body: revokeScehma.shape.body }),
  revokeHandler,
);
