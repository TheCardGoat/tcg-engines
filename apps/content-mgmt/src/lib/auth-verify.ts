import {
  createRemoteJWKSet,
  type JWTPayload,
  type JWTVerifyResult,
  jwtVerify,
} from "jose";
import { env } from "../config/env";

/**
 * Auth payload from JWT token
 *
 * This matches the payload defined in auth-service's JWT plugin
 */
export interface AuthPayload extends JWTPayload {
  id: string;
  email: string;
  name?: string;
  subscriptionTier?: string;
}

/**
 * Cached JWKS to avoid repeated fetches
 *
 * The JWKS is fetched from auth-service and cached.
 * Cache is cleared on key rotation errors (kid mismatch).
 */
let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Get JWKS from auth service
 *
 * Creates a remote JWKS set that fetches keys from auth-service.
 * The jose library handles caching internally.
 */
function getJWKS(): ReturnType<typeof createRemoteJWKSet> {
  if (!cachedJWKS) {
    const jwksUrl = new URL(`${env.AUTH_SERVICE_URL}/api/auth/jwks`);
    cachedJWKS = createRemoteJWKSet(jwksUrl);
  }
  return cachedJWKS;
}

/**
 * Clear JWKS cache
 *
 * Call this when key rotation is detected (kid mismatch error)
 */
export function clearJWKSCache(): void {
  cachedJWKS = null;
}

/**
 * Verify JWT token from auth service
 *
 * Validates the token using JWKS from auth-service.
 * Returns the decoded payload if valid, null otherwise.
 *
 * @param token - JWT token string (without "Bearer " prefix)
 * @returns Decoded payload or null if invalid
 *
 * @example
 * ```ts
 * const payload = await verifyAuthToken(token);
 * if (payload) {
 *   console.log(`User ${payload.id} authenticated`);
 * }
 * ```
 */
export async function verifyAuthToken(
  token: string,
): Promise<AuthPayload | null> {
  try {
    const JWKS = getJWKS();
    const result: JWTVerifyResult = await jwtVerify(token, JWKS, {
      issuer: env.AUTH_SERVICE_URL,
      audience: env.AUTH_SERVICE_URL,
    });

    return result.payload as AuthPayload;
  } catch (error) {
    // Log error for debugging
    if (env.NODE_ENV !== "production") {
      console.error("Token verification failed:", error);
    }

    // Handle key rotation - clear cache and retry once
    if (error instanceof Error && error.message.includes("kid")) {
      clearJWKSCache();

      try {
        const JWKS = getJWKS();
        const result: JWTVerifyResult = await jwtVerify(token, JWKS, {
          issuer: env.AUTH_SERVICE_URL,
          audience: env.AUTH_SERVICE_URL,
        });

        return result.payload as AuthPayload;
      } catch {
        // Retry failed, token is invalid
        return null;
      }
    }

    return null;
  }
}

/**
 * Extract token from Authorization header
 *
 * @param authHeader - Authorization header value
 * @returns Token string or null if not a Bearer token
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7); // Remove "Bearer " prefix
}
