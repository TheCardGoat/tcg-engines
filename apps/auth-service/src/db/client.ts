import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let connectionString: string | undefined;
let _db: Database | null = null;

/**
 * Initialize the database connection.
 *
 * This should be called once at application startup with the database URL.
 * Subsequent calls are ignored (singleton pattern).
 *
 * @param databaseUrl - PostgreSQL connection string
 */
export function initDatabase(databaseUrl: string): void {
  // Only initialize once - subsequent calls are ignored
  if (connectionString) {
    return;
  }

  if (!databaseUrl) {
    throw new Error(
      "Database URL cannot be empty. Ensure AUTH_DATABASE_URL environment variable is set.",
    );
  }

  connectionString = databaseUrl;
}

/**
 * Get the database instance.
 *
 * Returns the singleton database instance. Throws if initDatabase() hasn't been called.
 *
 * @returns The Drizzle database instance
 */
export function getDb(): Database {
  if (!_db) {
    _db = createDb();
  }

  return _db;
}

/**
 * Create a new database connection.
 *
 * Internal function that creates the actual database connection.
 */
function createDb(): Database {
  if (!connectionString) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    // Retry connection on "database starting up" (57P03) and other connection errors
    backoff: (attempt) => {
      // Exponential backoff: 0.1s, 0.2s, 0.4s... capped at 1s
      const delay = Math.min(0.1 * 2 ** attempt, 1);
      return delay;
    },
  });

  return drizzle(client, { schema });
}

/**
 * Database type for type inference
 */
export type Database = ReturnType<typeof drizzle<typeof schema>>;
