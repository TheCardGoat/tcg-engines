import type { AuthSession, AuthUser, SessionResult } from "@tcg/shared";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { Elysia } from "elysia";
import { env } from "../config/env";
import { getDb } from "../db/client";
import * as schema from "../db/schema";

// Re-export shared types for convenience
export type { AuthUser, AuthSession, SessionResult };

/**
 * Elysia requires types to extend Record<string, unknown> for context derivation
 */
export interface ElysiaSessionResult extends SessionResult, Record<string, unknown> {
  user: AuthUser | null;
  session: AuthSession | null;
}

/**
 * Get trusted origins for CORS and CSRF protection
 *
 * In production, requires explicit AUTH_CORS_ORIGIN configuration.
 * Wildcard is only allowed in development mode.
 */
function getTrustedOrigins(): string[] {
  if (env.NODE_ENV !== "production") {
    return ["*"];
  }

  const origins: string[] = [];

  // Add configured CORS origin
  if (env.AUTH_CORS_ORIGIN && env.AUTH_CORS_ORIGIN !== "*") {
    origins.push(env.AUTH_CORS_ORIGIN);
  }

  // Add base URL as trusted origin
  if (env.AUTH_BASE_URL) {
    origins.push(env.AUTH_BASE_URL);
  }

  if (origins.length === 0) {
    console.warn(
      "Warning: AUTH_CORS_ORIGIN not configured in production. CSRF protection may be weakened.",
    );
  }

  return origins.length > 0 ? origins : [];
}

/**
 * Better Auth configuration with JWT plugin for server-to-server authentication
 *
 * - Discord OAuth ONLY (no email/password)
 * - JWT plugin provides /api/auth/jwks and /api/auth/token endpoints
 * - Short-lived JWT tokens (15 minutes) for stateless verification
 */
const betterAuthConfig: BetterAuthOptions = {
  secret: env.AUTH_SECRET,

  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
        rotationInterval: 60 * 60 * 24 * 30, // 30 days
        gracePeriod: 60 * 60 * 24 * 7, // 7 days grace period for key rotation
      },
      jwt: {
        issuer: env.AUTH_BASE_URL,
        audience: env.AUTH_BASE_URL,
        expirationTime: "15m", // Short-lived tokens for S2S
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          // Include subscription tier for authorization in content service
          subscriptionTier:
            (user as AuthUser & { subscriptionTier?: string }).subscriptionTier || "free",
        }),
      },
    }),
  ],

  // DISABLE email/password - Discord OAuth ONLY
  emailAndPassword: {
    enabled: false,
  },

  session: {
    // Cookie configuration for session management
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  trustedOrigins: getTrustedOrigins(),

  advanced: {
    cookiePrefix: "tcg-auth",
    useSecureCookies: env.NODE_ENV === "production",
  },

  // Discord OAuth - only enabled if credentials are provided
  // This allows local development without Discord setup
  ...(env.AUTH_DISCORD_CLIENT_ID &&
    env.AUTH_DISCORD_CLIENT_SECRET && {
      socialProviders: {
        discord: {
          clientId: env.AUTH_DISCORD_CLIENT_ID,
          clientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
        },
      },
    }),
};

/**
 * Better Auth instance
 *
 * Lazily initialized to ensure database is ready.
 */
let _auth: ReturnType<typeof betterAuth<BetterAuthOptions>> | null = null;

function getAuth(): ReturnType<typeof betterAuth<BetterAuthOptions>> {
  if (!_auth) {
    _auth = betterAuth({
      ...betterAuthConfig,
      database: drizzleAdapter(getDb(), {
        provider: "pg",
        schema,
        usePlural: true,
      }),
    });
  }
  return _auth;
}

/**
 * Shared session retrieval logic
 * Attempts to get the current session from the request headers
 */
async function getSession(request: Request): Promise<ElysiaSessionResult> {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user && session?.session) {
      return {
        session: session.session as AuthSession,
        user: session.user as AuthUser,
      };
    }
  } catch (error) {
    // Session retrieval failed, user is not authenticated
    console.error("Session retrieval error:", error);
  }

  return {
    session: null,
    user: null,
  };
}

/**
 * Guard for protected routes
 *
 * Use this to ensure a route requires authentication.
 * Returns 401 if user is not authenticated.
 *
 * Usage:
 * ```ts
 * app.use(authGuard).get('/protected', ({ user }) => {
 *   // user is guaranteed to be defined here
 *   return { userId: user.id };
 * });
 * ```
 */
export const authGuard = new Elysia({ name: "auth-guard" }).derive(async ({ request, set }) => {
  const result = await getSession(request);

  if (!(result.user && result.session)) {
    // User is not authenticated - return 401
    set.status = 401;
    return {
      ...result,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    };
  }

  return result;
});

/**
 * Helper function to assert user is authenticated
 *
 * Use this in route handlers that require authentication.
 * Returns the authenticated user or sets status and throws an error.
 *
 * Usage:
 * ```ts
 * .get('/protected', async ({ user, set }) => {
 *   const authenticatedUser = requireAuth(user, set);
 *   // authenticatedUser is guaranteed to be AuthUser
 *   return { userId: authenticatedUser.id };
 * })
 * ```
 */
export function requireAuth(user: AuthUser | null, set: { status?: number | string }): AuthUser {
  if (!user) {
    set.status = 401;
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

/**
 * Better Auth Elysia plugin with macro support
 *
 * This plugin:
 * 1. Mounts the Better Auth handler for all /api/auth/* routes
 * 2. Provides a macro for easy auth checking on routes
 *
 * Usage:
 * ```ts
 * app
 *   .use(betterAuthMacro)
 *   .get('/public', () => 'public', { auth: false })
 *   .get('/protected', ({ user }) => user, { auth: true })
 * ```
 *
 * When `auth: true`, the route will return 401 if the user is not authenticated.
 * When `auth: false` or not set, session info is still resolved but not enforced.
 */
export const betterAuthMacro = new Elysia({ name: "better-auth" })
  .mount(async (request) => {
    const auth = getAuth();
    const response = await auth.handler(request);
    return response;
  })
  .macro({
    auth: (enabled: boolean) => ({
      async beforeHandle({ request, set }) {
        if (!enabled) {
          return;
        }

        const session = await getSession(request);
        if (!(session.user && session.session)) {
          set.status = 401;
          return {
            error: "UNAUTHORIZED",
            message: "Authentication required",
          };
        }
      },
      async resolve({ request }) {
        const session = await getSession(request);
        return {
          session: session.session,
          user: session.user,
        };
      },
    }),
  });
