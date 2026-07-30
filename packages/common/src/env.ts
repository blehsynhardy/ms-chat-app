import { ZodObject, ZodRawShape, z } from "zod";

interface EnvOptions {
  source?: NodeJS.ProcessEnv;
  serviceName?: string;
}

export const createEnv = <TSchema extends ZodRawShape>(
  schema: ZodObject<TSchema>,
  options: EnvOptions = {},
): z.infer<ZodObject<TSchema>> => {
  const { source = process.env, serviceName = "service" } = options;

  const parsed = schema.safeParse(source);

  if (!parsed.success) {
    const formattedErrors = parsed.error.format();
    throw new Error(
      `[${serviceName}] Environment variable validation failed: ${JSON.stringify(formattedErrors)}`,
    );
  }

  return parsed.data;
};
