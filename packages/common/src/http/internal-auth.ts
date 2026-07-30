import { HttpError } from "../errors/http-errors";

import type { RequestHandler } from "express";

export interface InternalAuthOptions {
  headerName?: string;
  exemptPath?: string[];
}

const DEFAULT_HEADER_NAME = "x-internal-token";

export const createInternalAuthMiddleware = (
  expectedToken: string,
  options: InternalAuthOptions = {},
): RequestHandler => {
  const headerName = options.headerName?.toLowerCase() ?? DEFAULT_HEADER_NAME;
  const exemptPaths = new Set(options.exemptPath ?? []);

  return (req, _res, next) => {
    if (exemptPaths.has(req.path)) {
      next();
      return;
    }

    const provided = req.get(headerName) ?? req.headers[headerName];
    const token = Array.isArray(provided) ? provided[0] : provided;
    const normalizedExpectedToken = expectedToken.trim();
    const normalizedProvidedToken =
      typeof token === "string" ? token.trim() : undefined;

    if (
      typeof normalizedProvidedToken !== "string" ||
      normalizedProvidedToken !== normalizedExpectedToken
    ) {
  
      next(new HttpError(401, "unauthorized"));
      return;
    }

    next();
  };
};
