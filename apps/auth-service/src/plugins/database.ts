import { Elysia } from "elysia";
import { env } from "../config/env";
import { getDb, initDatabase } from "../db/client";

/**
 * Database plugin for Elysia
 *
 * Provides database access to route handlers via context derivation.
 * The database is initialized once at startup and reused across requests.
 *
 * Usage:
 * ```ts
 * app
 *   .use(databasePlugin)
 *   .get('/users', ({ db }) => {
 *     return db.select().from(users);
 *   })
 * ```
 */
export const databasePlugin = new Elysia({ name: "database" }).derive(() => {
  // Only initialize database if AUTH_DATABASE_URL is provided
  if (env.AUTH_DATABASE_URL) {
    initDatabase(env.AUTH_DATABASE_URL);
  }

  return {
    db: env.AUTH_DATABASE_URL ? getDb() : null,
  };
});
