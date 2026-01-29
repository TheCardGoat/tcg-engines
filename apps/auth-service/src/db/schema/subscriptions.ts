import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * Digest frequency enum
 */
export const digestFrequencyEnum = pgEnum("digest_frequency", [
  "daily",
  "weekly",
]);

/**
 * User subscriptions table - Creator follows
 *
 * Tracks which creators a user follows for content updates.
 * Note: creatorId references the Content Service's creators table (not a FK).
 */
export const userSubscriptions = pgTable(
  "user_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    // Reference to Content Service creator (not a FK - validated via inter-service communication)
    creatorId: uuid("creator_id").notNull(),
    // Optional game filter for subscription
    gameId: uuid("game_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_subscriptions_user_id_idx").on(table.userId),
    index("user_subscriptions_creator_id_idx").on(table.creatorId),
    unique("user_subscriptions_user_creator_unique").on(
      table.userId,
      table.creatorId,
    ),
  ],
);

/**
 * Digest preferences table - Email digest settings
 *
 * Stores user preferences for content digest emails.
 */
export const digestPreferences = pgTable("digest_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  frequency: digestFrequencyEnum("frequency").notNull().default("daily"),
  deliveryTime: time("delivery_time").notNull().default("09:00:00"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Digest history table - Sent digest records
 *
 * Tracks which digests have been sent to users.
 */
export const digestHistory = pgTable(
  "digest_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    // Reference to Content Service game (not a FK)
    gameId: uuid("game_id"),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
    // Array of content IDs included in this digest
    contentIds: jsonb("content_ids").$type<string[]>().notNull().default([]),
  },
  (table) => [
    index("digest_history_user_id_idx").on(table.userId),
    index("digest_history_sent_at_idx").on(table.sentAt),
  ],
);

// Type exports
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;
export type DigestPreference = typeof digestPreferences.$inferSelect;
export type NewDigestPreference = typeof digestPreferences.$inferInsert;
export type DigestHistoryRecord = typeof digestHistory.$inferSelect;
export type NewDigestHistoryRecord = typeof digestHistory.$inferInsert;

// Relations
export const userSubscriptionsRelations = relations(
  userSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [userSubscriptions.userId],
      references: [users.id],
    }),
  }),
);

export const digestPreferencesRelations = relations(
  digestPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [digestPreferences.userId],
      references: [users.id],
    }),
  }),
);

export const digestHistoryRelations = relations(digestHistory, ({ one }) => ({
  user: one(users, {
    fields: [digestHistory.userId],
    references: [users.id],
  }),
}));
