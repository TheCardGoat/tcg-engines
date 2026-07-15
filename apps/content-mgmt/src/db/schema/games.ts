import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Games table - Supported games for content categorization
 */
export const games = pgTable(
  "games",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    description: text("description"),
    id: uuid("id").primaryKey().defaultRandom(),
    isActive: boolean("is_active").default(true).notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("games_slug_idx").on(table.slug),
    index("games_is_active_idx").on(table.isActive),
  ],
);

// Type exports
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
