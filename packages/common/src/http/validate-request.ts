import { z } from "zod";
import { HttpError } from "../errors/http-errors";

import type { NextFunction, Request, Response } from "express";
import type { ZodObject, ZodType } from "zod";
import { ZodError } from "zod";

type Schema = ZodObject | ZodType;
type ParamsRecord = Record<string, string>;
type QueryRecord = Record<string, unknown>;

export interface RequestValidationSchema {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

const formatedError = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

export const validateRequest = (schema: RequestValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const parsedBody = schema.body.parse(req.body) as unknown;
        req.body = parsedBody;
      }

      if (schema.params) {
        const parsedParams = schema.params.parse(req.params) as ParamsRecord;
        req.params = parsedParams as Request["params"];
      }

      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query) as QueryRecord;
        req.query = parsedQuery as Request["query"];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new HttpError(400, "Validation Error", { issue: formatedError(error) }),
        );
        return;
      }
      next(error);
    }
  };
};
