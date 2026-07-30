import { createEnv, z } from "@chatapp/common";
import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  AUTH_SERVICE_PORT: z.coerce.number().min(0).max(65535).default(4003),
  AUTH_DB_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  JWT_SECRET_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET_EXPIRES_IN: z.string().default("30d"),
  INTERNAL_AUTH_TOKEN : z.string().min(32),
  RABBITMQ_URL : z.url()
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "auth-service",
});

export type Env = typeof env;
