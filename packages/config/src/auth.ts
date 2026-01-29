import { createEnv } from "@t3-oss/env-core";
import type { z } from "zod";
import { authServerSchema } from "./schema";

/**
 * Auth Service environment validation using @t3-oss/env-core.
 *
 * This validates all auth service environment variables at startup and provides
 * type-safe access throughout the application.
 */

/**
 * Type of the validated environment object.
 * Extracts the inferred type from the Zod schema.
 */
export type AuthEnv = z.infer<z.ZodObject<typeof authServerSchema>>;

/**
 * Validated environment object for Auth Service.
 *
 * Access environment variables like:
 * - `authEnv.AUTH_DATABASE_URL`
 * - `authEnv.AUTH_PORT`
 * - `authEnv.AUTH_SECRET`
 *
 * All values are properly typed and validated.
 */
export const authEnv = createEnv({
  isServer: true,
  server: authServerSchema,
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

/**
 * Parse environment variables from a custom runtime environment.
 *
 * Use this for embedded mode where environment variables
 * come from a source other than process.env.
 *
 * @param runtimeEnv - Object containing environment variables
 * @returns Validated environment object
 *
 * @example
 * ```ts
 * const parsed = parseAuthEnv({
 *   AUTH_DATABASE_URL: 'postgres://...',
 *   AUTH_SECRET: '...'
 * });
 * ```
 */
export function parseAuthEnv(
  runtimeEnv: Record<string, string | undefined>,
): AuthEnv {
  return createEnv({
    isServer: true,
    server: authServerSchema,
    runtimeEnv,
    emptyStringAsUndefined: true,
  });
}

/**
 * Assert that the environment is valid.
 *
 * Throws an error if required environment variables are missing.
 * Call this at application startup to fail fast.
 *
 * @returns The validated environment object
 *
 * @example
 * ```ts
 * if (process.env.NODE_ENV !== 'test') {
 *   assertAuthEnv();
 * }
 * ```
 */
export function assertAuthEnv(): AuthEnv {
  // Accessing authEnv will trigger validation
  // If validation fails, createEnv throws an error
  return authEnv;
}

/**
 * Get an environment variable value with type safety.
 *
 * This is a convenience function for accessing individual variables.
 * Prefer direct access via `authEnv.VARIABLE_NAME` for better IDE support.
 *
 * @param key - Environment variable name
 * @returns The environment variable value
 */
export function getAuthEnv<K extends keyof AuthEnv>(key: K): AuthEnv[K] {
  return authEnv[key];
}
