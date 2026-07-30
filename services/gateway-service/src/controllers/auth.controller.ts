import { authProxyService } from "@/services/auth-proxy.services";
import { loginScehma, refreshScehma, registerScehma, revokeScehma } from "@/validation/auth.schema";
import { AsyncHandler } from "@chatapp/common";

export const registerUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = registerScehma.parse(req.body);
    const response = await authProxyService.register(payload);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = loginScehma.parse(req.body);
    const response = await authProxyService.login(payload);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const refreshTokens: AsyncHandler = async (req, res, next) => {
  try {
    const payload = refreshScehma.parse(req.body);
    const response = await authProxyService.refresh(payload);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};


export const revokeTokens: AsyncHandler = async (req, res, next) => {
  try {
    const payload = revokeScehma.parse(req.body);
    await authProxyService.revoke(payload);
    res.status(204).send();
  } catch (error) {
    next(error); 
  }
};
