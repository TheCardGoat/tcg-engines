import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * JWKS table - JSON Web Key Set storage
 *
 * This table is managed by Better Auth JWT plugin and stores
 * the public/private key pairs used for JWT signing and verification.
 *
 * The keys are automatically rotated based on the rotationInterval
 * configured in the JWT plugin.
 */
export const jwks = pgTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Type exports
export type Jwk = typeof jwks.$inferSelect;
export type NewJwk = typeof jwks.$inferInsert;
