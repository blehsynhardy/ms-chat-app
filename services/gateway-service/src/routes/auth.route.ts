import { loginUser, refreshTokens, registerUser, revokeTokens } from "@/controllers/auth.controller";
import { loginScehma, refreshScehma, registerScehma, revokeScehma } from "@/validation/auth.schema";
import { asyncHandler, validateRequest } from "@chatapp/common";
import { Router } from "express";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({ body: registerScehma }),
  asyncHandler(registerUser),
);

authRouter.post(
  "/login",
  validateRequest({ body: loginScehma }),
  asyncHandler(loginUser),
);


authRouter.post(
  "/refresh",
  validateRequest({ body: refreshScehma }),
  asyncHandler(refreshTokens),
);


authRouter.post(
  "/revoke",
  validateRequest({ body: revokeScehma }),
  asyncHandler(revokeTokens),
);

