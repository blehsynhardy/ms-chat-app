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
  GATEWAY_PORT: z.coerce.number().min(0).max(65_535).default(4000),
  AUTH_SERVICE_URL: z.url(),
  INTERNAL_API_TOKEN: z.string().min(16),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "gateway-service",
});

export type Env = typeof env;
