import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database client singleton for Content Management Service
 *
 * This service has its own PostgreSQL database, separate from auth-service.
 */

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

/**
 * Initialize the database connection
 *
 * @param connectionString - PostgreSQL connection string
 */
export function initDatabase(connectionString: string): void {
  if (_db) {
    console.warn("Database already initialized");
    return;
  }

  _client = postgres(connectionString, {
    max: 10, // Connection pool size
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(_client, { schema });

  console.log("Content database initialized");
}

/**
 * Get the database instance
 *
 * @throws Error if database is not initialized
 */
export function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    throw new Error("Database not initialized. Call initDatabase() first with DATABASE_URL.");
  }
  return _db;
}

/**
 * Close the database connection
 *
 * Use this for graceful shutdown
 */
export async function closeDatabase(): Promise<void> {
  if (_client) {
    await _client.end();
    _client = null;
    _db = null;
    console.log("Content database connection closed");
  }
}
