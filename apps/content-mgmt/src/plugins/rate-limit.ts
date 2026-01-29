import { rateLimit } from "elysia-rate-limit";
import { env } from "../config/env";

/**
 * Generate a fallback identifier when IP cannot be determined
 *
 * Uses a combination of User-Agent and timestamp to create a unique-ish identifier.
 * This prevents all anonymous users from sharing the same rate limit bucket.
 */
function generateFallbackIdentifier(request: Request): string {
  const userAgent = request.headers.get("User-Agent") || "unknown-ua";
  // Create a hash-like string from the User-Agent to distinguish different clients
  const uaHash = userAgent
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `fallback:${uaHash}`;
}

/**
 * Get client identifier for rate limiting
 *
 * Priority: User ID -> IP Address -> Fallback
 * Uses Cloudflare headers if available.
 */
function getClientIdentifier(
  request: Request,
  user?: { id: string } | null,
): string {
  // If user is authenticated, use user ID
  if (user?.id) {
    return `user:${user.id}`;
  }

  // Try Cloudflare headers first
  const cfConnectingIp = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIp) {
    return `ip:${cfConnectingIp}`;
  }

  // Try X-Forwarded-For
  const xForwardedFor = request.headers.get("X-Forwarded-For");
  if (xForwardedFor) {
    const ip = xForwardedFor.split(",")[0].trim();
    if (ip) {
      return `ip:${ip}`;
    }
  }

  // Try X-Real-IP
  const xRealIp = request.headers.get("X-Real-IP");
  if (xRealIp) {
    return `ip:${xRealIp}`;
  }

  // Fallback to a unique-ish identifier based on User-Agent
  // This prevents rate limit bypass when all headers are stripped
  return generateFallbackIdentifier(request);
}

/**
 * Global rate limiter for all endpoints
 *
 * Returns null if rate limiting is disabled.
 */
export function globalRateLimiter() {
  if (!env.RATE_LIMIT_ENABLED) {
    return null;
  }

  return rateLimit({
    duration: 60_000, // 1 minute window
    max: env.RATE_LIMIT_GLOBAL_MAX,
    generator: (request) => {
      // Note: We don't have access to user context in the rate limiter generator
      // because it runs before the auth plugin. This is expected behavior.
      return getClientIdentifier(request);
    },
    errorResponse: new Response(
      JSON.stringify({
        error: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    ),
  });
}

/**
 * Health endpoint rate limiter
 *
 * Higher limit for health checks (monitoring systems).
 */
export function healthRateLimiter() {
  if (!env.RATE_LIMIT_ENABLED) {
    return null;
  }

  return rateLimit({
    duration: 60_000,
    max: 1000, // High limit for health checks
    scoping: "scoped",
    generator: (request) => getClientIdentifier(request),
    errorResponse: new Response(
      JSON.stringify({
        error: "RATE_LIMITED",
        message: "Too many health check requests.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    ),
  });
}

/**
 * Content submission rate limiter
 *
 * Stricter limit for content creation.
 */
export function contentSubmissionRateLimiter() {
  if (!env.RATE_LIMIT_ENABLED) {
    return null;
  }

  return rateLimit({
    duration: 3600_000, // 1 hour window
    max: 10, // 10 submissions per hour
    scoping: "scoped",
    generator: (request) => {
      // Note: We don't have access to user context in the rate limiter generator
      // because it runs before the auth plugin. This is expected behavior.
      return getClientIdentifier(request);
    },
    errorResponse: new Response(
      JSON.stringify({
        error: "RATE_LIMITED",
        message: "Content submission limit reached. Please try again later.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    ),
  });
}
