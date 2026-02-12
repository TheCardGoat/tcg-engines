import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Content Management Service environment schema
 */
const contentServerSchema = {
  // Database (own PostgreSQL instance)
  DATABASE_URL: z
    .string({
      message: "DATABASE_URL must be a valid PostgreSQL connection string",
    })
    .url()
    .describe("PostgreSQL connection string for content database"),

  // Auth Service URL for JWKS verification
  AUTH_SERVICE_URL: z
    .string({ message: "AUTH_SERVICE_URL must be a valid URL" })
    .url()
    .optional()
    .default("http://localhost:3001")
    .describe("Auth service URL for JWT verification via JWKS"),

  // Server
  PORT: z
    .string()
    .optional()
    .default("3002")
    .transform((val) => Number.parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, { message: "PORT must be at least 1" })
        .max(65_535, { message: "PORT must be at most 65535" }),
    )
    .describe("Content service port"),

  CORS_ORIGIN: z.string().optional().default("*").describe("CORS origin for content service"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development")
    .describe("Node environment"),

  // Rate Limiting
  RATE_LIMIT_ENABLED: z
    .enum(["true", "false"])
    .optional()
    .default("true")
    .transform((val) => val !== "false")
    .describe("Enable rate limiting"),

  RATE_LIMIT_GLOBAL_MAX: z
    .string()
    .optional()
    .default("200")
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .describe("Global requests per window"),

  RATE_LIMIT_GLOBAL_MAX_AUTH: z
    .string()
    .optional()
    .default("300")
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .describe("Global requests per window for authenticated users"),
};

/**
 * Type of the validated environment object
 */
export type ContentEnv = z.infer<z.ZodObject<typeof contentServerSchema>>;

/**
 * Validated environment object for Content Management Service
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: process.env,
  server: contentServerSchema,
});

/**
 * Parse environment variables from a custom runtime environment
 */
export function parseContentEnv(runtimeEnv: Record<string, string | undefined>): ContentEnv {
  return createEnv({
    emptyStringAsUndefined: true,
    isServer: true,
    runtimeEnv,
    server: contentServerSchema,
  });
}

/**
 * Assert that the environment is valid
 */
export function assertContentEnv(): ContentEnv {
  return env;
}
