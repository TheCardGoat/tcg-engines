import { z } from "zod";

/**
 * Zod schemas for Auth Service environment variables.
 * All auth-specific variables use AUTH_ prefix for clarity in multi-service deployments.
 */

// ============================================================================
// Database
// ============================================================================

export const authDatabaseUrlSchema = z
  .url({
    error: "AUTH_DATABASE_URL must be a valid PostgreSQL connection string",
  })
  .describe("PostgreSQL connection string for auth database");

// ============================================================================
// Authentication (Better Auth)
// ============================================================================

export const authSecretSchema = z
  .string()
  .min(32, { error: "AUTH_SECRET must be at least 32 characters" })
  .describe("Better Auth secret for session encryption");

export const authDiscordClientIdSchema = z
  .string()
  .min(1)
  .optional()
  .describe("Discord OAuth client ID");

export const authDiscordClientSecretSchema = z
  .string()
  .min(1)
  .optional()
  .describe("Discord OAuth client secret");

// ============================================================================
// Server Configuration
// ============================================================================

export const authPortSchema = z
  .string()
  .optional()
  .default("3001")
  .transform((val) => Number.parseInt(val, 10))
  .pipe(
    z
      .number()
      .int()
      .min(1, { error: "AUTH_PORT must be at least 1" })
      .max(65535, { error: "AUTH_PORT must be at most 65535" }),
  )
  .describe("Auth service port");

export const authCorsOriginSchema = z
  .string()
  .optional()
  .default("*")
  .describe("CORS origin for auth service");

export const authBaseUrlSchema = z
  .url({ error: "AUTH_BASE_URL must be a valid URL" })
  .optional()
  .default("http://localhost:3001")
  .describe("Base URL for auth service (used for JWT issuer/audience)");

export const nodeEnvSchema = z
  .enum(["development", "production", "test"])
  .optional()
  .default("development")
  .describe("Node environment");

// ============================================================================
// Rate Limiting
// ============================================================================

const createRateLimitSchema = (defaultValue: string) =>
  z
    .string()
    .optional()
    .default(defaultValue)
    .transform((val) => Number.parseInt(val, 10))
    .pipe(
      z.number().int().min(1, { error: "Rate limit value must be at least 1" }),
    );

export const authRateLimitEnabledSchema = z
  .enum(["true", "false"])
  .optional()
  .default("true")
  .transform((val) => val !== "false")
  .describe("Enable rate limiting");

export const authRateLimitGlobalMaxSchema = createRateLimitSchema(
  "200",
).describe("Global requests per window");

export const authRateLimitGlobalMaxAuthSchema = createRateLimitSchema(
  "300",
).describe("Global requests per window for authenticated users");

export const authRateLimitAuthMaxSchema = createRateLimitSchema("10").describe(
  "Auth endpoint requests per window",
);

// ============================================================================
// Combined Schema for Auth Service
// ============================================================================

export const authServerSchema = {
  // Database
  AUTH_DATABASE_URL: authDatabaseUrlSchema,

  // Authentication
  AUTH_SECRET: authSecretSchema,
  AUTH_DISCORD_CLIENT_ID: authDiscordClientIdSchema,
  AUTH_DISCORD_CLIENT_SECRET: authDiscordClientSecretSchema,

  // Server
  AUTH_PORT: authPortSchema,
  AUTH_CORS_ORIGIN: authCorsOriginSchema,
  AUTH_BASE_URL: authBaseUrlSchema,
  NODE_ENV: nodeEnvSchema,

  // Rate Limiting
  AUTH_RATE_LIMIT_ENABLED: authRateLimitEnabledSchema,
  AUTH_RATE_LIMIT_GLOBAL_MAX: authRateLimitGlobalMaxSchema,
  AUTH_RATE_LIMIT_GLOBAL_MAX_AUTH: authRateLimitGlobalMaxAuthSchema,
  AUTH_RATE_LIMIT_AUTH_MAX: authRateLimitAuthMaxSchema,
};
