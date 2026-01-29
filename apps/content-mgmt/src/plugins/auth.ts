import { Elysia } from "elysia";
import {
  type AuthPayload,
  extractBearerToken,
  verifyAuthToken,
} from "../lib/auth-verify";
import { UnauthorizedError } from "../lib/errors";

/**
 * Authenticated user from JWT token
 *
 * This is the user object available in route handlers
 * after JWT verification.
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  subscriptionTier?: string;
}

/**
 * Valid subscription tiers
 */
export const SUBSCRIPTION_TIERS = {
  free: 0,
  premium: 1,
  admin: 2,
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

/**
 * Convert AuthPayload to AuthUser
 */
function payloadToUser(payload: AuthPayload): AuthUser {
  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    subscriptionTier: payload.subscriptionTier,
  };
}

/**
 * Auth plugin for Content Management Service
 *
 * This plugin:
 * 1. Extracts JWT from Authorization header
 * 2. Verifies JWT using JWKS from auth-service
 * 3. Provides user context to route handlers
 * 4. Provides `auth` macro for requiring authentication
 *
 * Note: Authentication only runs when `auth: true` is set on a route.
 * Public routes skip JWT verification entirely for better performance.
 *
 * @example
 * ```ts
 * app
 *   .use(authPlugin)
 *   .get('/public', () => 'public')
 *   .get('/protected', ({ user }) => user, { auth: true })
 *   .get('/optional', ({ user }) => user ? `Hello ${user.name}` : 'Hello guest')
 * ```
 */
export const authPlugin = new Elysia({ name: "content-auth" })
  .macro({
    /**
     * Auth macro for requiring authentication
     *
     * When `auth: true`, verifies JWT and returns 401 if user is not authenticated.
     * When `auth: false` or not set, authentication is skipped entirely.
     */
    auth: (required: boolean) => ({
      async resolve({ request }: { request: Request }) {
        // Skip authentication entirely for non-protected routes
        if (!required) {
          return { user: null as AuthUser | null };
        }

        const authHeader = request.headers.get("Authorization");
        const token = extractBearerToken(authHeader);

        if (!token) {
          return { user: null as AuthUser | null };
        }

        const payload = await verifyAuthToken(token);

        if (!payload) {
          return { user: null as AuthUser | null };
        }

        return {
          user: payloadToUser(payload),
        };
      },
      async beforeHandle({
        user,
        set,
      }: {
        user?: AuthUser | null;
        set: { status?: number | string };
      }) {
        if (required && !user) {
          set.status = 401;
          return {
            error: "UNAUTHORIZED",
            message: "Authentication required",
          };
        }
      },
    }),
  })
  .as("global");

/**
 * Helper function to assert user is authenticated
 *
 * Use this in route handlers that require authentication.
 * Returns the authenticated user or throws an error.
 *
 * @param user - User from context (may be null)
 * @param set - Elysia set object for status
 * @returns Authenticated user
 * @throws UnauthorizedError if user is not authenticated
 *
 * @example
 * ```ts
 * .post('/content', async ({ user, set, body }) => {
 *   const authenticatedUser = requireAuth(user, set);
 *   // authenticatedUser is guaranteed to be AuthUser
 *   return createContent(body, authenticatedUser.id);
 * })
 * ```
 */
export function requireAuth(
  user: AuthUser | null,
  set: { status?: number | string },
): AuthUser {
  if (!user) {
    set.status = 401;
    throw new UnauthorizedError();
  }
  return user;
}

/**
 * Check if user has required subscription tier
 *
 * @param user - Authenticated user
 * @param requiredTier - Required subscription tier
 * @returns True if user has required tier or higher
 */
export function hasSubscriptionTier(
  user: AuthUser,
  requiredTier: SubscriptionTier,
): boolean {
  const userTierName = user.subscriptionTier || "free";

  // Validate that userTier is a known tier
  if (!(userTierName in SUBSCRIPTION_TIERS)) {
    // Unknown tier, deny access for safety
    return false;
  }

  const userTier = userTierName as SubscriptionTier;
  return SUBSCRIPTION_TIERS[userTier] >= SUBSCRIPTION_TIERS[requiredTier];
}
