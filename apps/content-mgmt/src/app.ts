import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { assertContentEnv, env } from "./config/env";
import { initDatabase } from "./db/client";
import { isUnauthorizedError } from "./lib/errors";
import { authPlugin } from "./plugins/auth";
import { globalRateLimiter, healthRateLimiter } from "./plugins/rate-limit";

export interface AppOptions {
  prefix?: string;
  corsOrigin?: string | string[];
}

/**
 * Create the Content Management Service Elysia application
 *
 * @param options - Application options
 * @returns Configured Elysia application
 */
export function createApp(options: AppOptions = {}) {
  const { prefix = "", corsOrigin = env.CORS_ORIGIN } = options;

  // Fail fast if required env vars are missing (skip in tests)
  if (process.env.NODE_ENV !== "test") {
    assertContentEnv();
  }

  // Initialize database early for standalone mode
  if (env.DATABASE_URL) {
    initDatabase(env.DATABASE_URL);
  }

  const globalLimiter = globalRateLimiter();
  const healthLimiter = healthRateLimiter();

  let app = new Elysia({ prefix })
    // Global error handler - converts thrown errors to JSON responses
    .onError(({ code, error, set }) => {
      // Get error message safely
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle UNAUTHORIZED errors using proper error class
      if (isUnauthorizedError(error)) {
        set.status = 401;
        return {
          error: "UNAUTHORIZED",
          message: error.message,
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
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: corsOrigin,
      }),
    )
    .use(authPlugin);

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
      // Health endpoint - no user PII, only service status
      .get("/health", () => ({
        service: "content-mgmt",
        status: "ok",
        timestamp: new Date().toISOString(),
      }))
      // API v1 routes - placeholder for future routes
      .group("/v1", (app) =>
        app
          .get("/", () => ({
            endpoints: ["GET /v1/contents", "GET /v1/games", "GET /v1/creators"],
            message: "Content Management Service API v1",
          }))
          // Protected endpoint example
          .get(
            "/me",
            ({ user }) => ({
              user,
            }),
            { auth: true },
          ),
      )
  );
}

// For standalone use and type inference
export type App = ReturnType<typeof createApp>;
