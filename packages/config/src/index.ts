/**
 * @tcg/config - Environment configuration package
 *
 * Provides type-safe environment variable validation using Zod and @t3-oss/env-core.
 */

// Auth service environment exports
export {
  type AuthEnv,
  assertAuthEnv,
  authEnv,
  getAuthEnv,
  parseAuthEnv,
} from "./auth";
// Schema exports
export * from "./schema";
