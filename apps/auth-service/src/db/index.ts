/**
 * Auth Service Database Module
 *
 * Self-contained database client and schema for the Auth Service.
 */

export { type Database, getDb, initDatabase } from "./client";
export * from "./schema";
