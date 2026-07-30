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
  USER_SERVICE_PORT: z.coerce.number().min(0).max(65535).default(4001),
  USER_DB_URL: z.url(),
  INTERNAL_AUTH_TOKEN: z.string().min(16),
  RABBITMQ_URL: z.url().optional()
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "user-service",
});

export type Env = typeof env;
