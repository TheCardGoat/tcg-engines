/**
 * Content Management Service Database
 *
 * Re-exports database client and schema for convenience.
 */

export { closeDatabase, getDb, initDatabase } from "./client";
export * from "./schema";
