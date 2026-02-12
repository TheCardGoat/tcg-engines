import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { assertAuthEnv, env } from "./config/env";
import { initDatabase } from "./db/client";
import { betterAuthMacro } from "./plugins/auth";
import { globalRateLimiter, healthRateLimiter } from "./plugins/rate-limit";
import { usersRoutes } from "./routes/users";

export interface AppOptions {
  prefix?: string;
  corsOrigin?: string | string[];
}

/**
 * Create the Auth Service Elysia application
 *
 * @param options - Application options
 * @returns Configured Elysia application
 */
export function createApp(options: AppOptions = {}) {
  const { prefix = "", corsOrigin = env.AUTH_CORS_ORIGIN } = options;

  // Fail fast if required env vars are missing (skip in tests)
  if (process.env.NODE_ENV !== "test") {
    assertAuthEnv();
  }

  // Initialize database early for standalone mode
  if (env.AUTH_DATABASE_URL) {
    initDatabase(env.AUTH_DATABASE_URL);
  }

  const globalLimiter = globalRateLimiter();
  const healthLimiter = healthRateLimiter();

  let app = new Elysia({ prefix })
    // Global error handler - converts thrown errors to JSON responses
    .onError(({ code, error, set }) => {
      // Get error message safely
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle UNAUTHORIZED errors
      if (errorMessage === "UNAUTHORIZED") {
        set.status = 401;
        return {
          error: "UNAUTHORIZED",
          message: "Authentication required",
        };
      }

      // Handle validation errors
      if (code === "VALIDATION") {
        set.status = 400;
        return {
          error: "VALIDATION_ERROR",
          message: errorMessage,
        };
      }

      // Handle not found errors
      if (code === "NOT_FOUND") {
        set.status = 404;
        return {
          error: "NOT_FOUND",
          message: "Resource not found",
        };
      }

      // Handle other errors
      if (code === "INTERNAL_SERVER_ERROR") {
        set.status = 500;
        return {
          error: "INTERNAL_ERROR",
          message: errorMessage,
        };
      }

      // Default error response
      set.status = 500;
      return {
        error: "INTERNAL_ERROR",
        message: errorMessage,
      };
    })
    .use(
      logger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
      }),
    )
    .use(
      cors({
        origin: corsOrigin,
        credentials: true, // Allow cookies for auth
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    )
    .use(betterAuthMacro);

  // Apply global rate limiting if enabled
  if (globalLimiter) {
    app = app.use(globalLimiter);
  }

  // Apply health rate limiting if enabled
  if (healthLimiter) {
    app = app.use(healthLimiter);
  }

  return (
    app
      .get(
        "/health",
        ({ user, session }) => ({
          authenticated: Boolean(session),
          service: "auth-service",
          status: "ok",
          timestamp: new Date().toISOString(),
          user: user
            ? {
                email: user.email,
                id: user.id,
                name: user.name,
              }
            : null,
        }),
        { auth: true },
      )
      // API v1 routes
      .group("/v1", (app) => app.use(usersRoutes))
  );
}

// For standalone use and type inference
export type App = ReturnType<typeof createApp>;
