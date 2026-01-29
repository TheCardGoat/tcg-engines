import { rateLimit } from "elysia-rate-limit";
import { env } from "../config/env";

/**
 * Get client identifier for rate limiting
 *
 * Priority: User ID → IP Address
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
    return `ip:${ip}`;
  }

  // Try X-Real-IP
  const xRealIp = request.headers.get("X-Real-IP");
  if (xRealIp) {
    return `ip:${xRealIp}`;
  }

  // Fallback to unknown
  return "ip:unknown";
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
    generator: (request, _server, { store }) => {
      const user = (store as { user?: { id: string } | null }).user;
      return getClientIdentifier(request, user);
    },
    responseMessage: {
      error: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    },
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
    responseMessage: {
      error: "RATE_LIMITED",
      message: "Too many health check requests.",
    },
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
    generator: (request, _server, { store }) => {
      const user = (store as { user?: { id: string } | null }).user;
      return getClientIdentifier(request, user);
    },
    responseMessage: {
      error: "RATE_LIMITED",
      message: "Content submission limit reached. Please try again later.",
    },
  });
}
