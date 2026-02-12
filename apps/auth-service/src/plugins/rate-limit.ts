import { rateLimit } from "elysia-rate-limit";
import { env } from "../config/env";

/**
 * Rate limit error response matching the app error format
 */
const RATE_LIMIT_RESPONSE: Response = new Response(
  JSON.stringify({
    error: "RATE_LIMIT_EXCEEDED",
    message: "Rate limit exceeded. Please try again later.",
    statusCode: 429,
  }),
  {
    headers: {
      "Content-Type": "application/json",
    },
    status: 429,
  },
);

/**
 * Cloudflare-aware IP generator
 *
 * Checks headers in priority order:
 * 1. CF-Connecting-IP (Cloudflare)
 * 2. X-Forwarded-For (standard proxy header)
 * 3. X-Real-IP (nginx/common proxy)
 * 4. Fallback to server.requestIP() (Elysia default)
 * 5. Final fallback to 'unknown'
 */
function getClientIdentifier(request: Request, server: unknown): string {
  // Handle undefined request
  if (!request) {
    return "unknown";
  }

  // Handle incomplete request object
  if (!request.headers || typeof request.headers.get !== "function") {
    return "unknown";
  }

  // Try Cloudflare header first
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    return cfIp;
  }

  // Try standard proxy headers
  const forwardedFor = request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
    // The first IP is the original client
    const firstIp = forwardedFor.split(",")[0]?.trim();
    return firstIp && firstIp.length > 0 ? firstIp : "unknown";
  }

  // Try X-Real-IP
  const realIp = request.headers.get("X-Real-IP");
  if (realIp) {
    return realIp;
  }

  // Fallback to Elysia's built-in IP detection
  if (
    server &&
    typeof server === "object" &&
    "requestIP" in (server as Record<string, unknown>) &&
    typeof (server as { requestIP?: (req: Request) => { address?: string } }).requestIP ===
      "function"
  ) {
    const ip = (server as { requestIP?: (req: Request) => { address?: string } }).requestIP!(
      request,
    );
    return ip?.address || "unknown";
  }
  return "unknown";
}

/**
 * Hierarchical rate limit identifier generator
 *
 * Priority: User ID → Session Token → IP
 * All levels use the same rate limit, just different identifiers
 */
function getHierarchicalIdentifier(request: Request, server: unknown, derived: unknown): string {
  // Priority 1: User ID (all sessions share one bucket)
  if (
    derived &&
    typeof derived === "object" &&
    "user" in derived &&
    (derived as { user?: { id?: string } }).user?.id
  ) {
    return `user:${(derived as { user?: { id?: string } }).user!.id!}`;
  }

  // Priority 2: Session Token (per-session bucket)
  if (
    derived &&
    typeof derived === "object" &&
    "session" in derived &&
    (derived as { session?: { token?: string } }).session?.token
  ) {
    return `session:${(derived as { session?: { token?: string } }).session!.token!}`;
  }

  // Priority 3: IP Address (anonymous users)
  return getClientIdentifier(request, server);
}

/**
 * Check if rate limiting is enabled via environment variable.
 */
function isRateLimitEnabled(): boolean {
  return env.AUTH_RATE_LIMIT_ENABLED;
}

/**
 * Global rate limiter - fallback for all endpoints
 *
 * Limits: 200 requests/minute (anonymous)
 * Uses IP-based identification (applied before auth middleware)
 * Note: Authenticated endpoints use their own rate limiters with higher limits
 */
export const globalRateLimiter = (): ReturnType<typeof rateLimit> | undefined => {
  if (!isRateLimitEnabled()) {
    return undefined;
  }
  return rateLimit({
    duration: 60_000, // 1 minute
    max: env.AUTH_RATE_LIMIT_GLOBAL_MAX,
    generator: getClientIdentifier,
    errorResponse: RATE_LIMIT_RESPONSE,
    headers: true,
  });
};

/**
 * Health check rate limiter
 *
 * Limits: 1000 requests/minute (very lenient for monitoring)
 */
export const healthRateLimiter = (): ReturnType<typeof rateLimit> | undefined => {
  if (!isRateLimitEnabled()) {
    return undefined;
  }
  return rateLimit({
    duration: 60_000, // 1 minute
    max: 1000,
    generator: getClientIdentifier,
    errorResponse: RATE_LIMIT_RESPONSE,
    headers: true,
  });
};

/**
 * Auth endpoints rate limiter
 *
 * Limits: 10 requests/minute (prevents brute force)
 * Always IP-based for auth endpoints
 */
export const authRateLimiter = (): ReturnType<typeof rateLimit> | undefined => {
  if (!isRateLimitEnabled()) {
    return undefined;
  }
  return rateLimit({
    duration: 60_000, // 1 minute
    max: env.AUTH_RATE_LIMIT_AUTH_MAX,
    generator: getClientIdentifier,
    errorResponse: RATE_LIMIT_RESPONSE,
    headers: true,
  });
};

/**
 * User endpoints rate limiter
 *
 * Limits: 60 requests/minute
 * Uses hierarchical identifier: User ID → Session Token → IP
 */
export const userRateLimiter = (): ReturnType<typeof rateLimit> | undefined => {
  if (!isRateLimitEnabled()) {
    return undefined;
  }
  return rateLimit({
    duration: 60_000, // 1 minute
    max: 60,
    generator: getHierarchicalIdentifier,
    errorResponse: RATE_LIMIT_RESPONSE,
    headers: true,
  });
};
