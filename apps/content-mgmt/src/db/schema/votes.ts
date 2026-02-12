import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

/**
 * Votes table - User votes on content and comments
 */
export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Reference to auth service user - NOT a foreign key
    userId: text("user_id").notNull(),
    targetType: text("target_type", { enum: ["content", "comment"] }).notNull(),
    targetId: uuid("target_id").notNull(),
    voteType: text("vote_type", { enum: ["up", "down"] }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("votes_user_target_unique").on(table.userId, table.targetType, table.targetId),
    index("votes_user_id_idx").on(table.userId),
    index("votes_target_idx").on(table.targetType, table.targetId),
  ],
);

// Type exports
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
