import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { games } from "./games";

/**
 * Creator metadata interface
 */
interface CreatorMetadata {
  archetype?: string;
  specialties?: string[];
  verified?: boolean;
}

/**
 * Creators table - Content creators (YouTube channels, etc.)
 */
export const creators = pgTable(
  "creators",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    platformId: text("platform_id").notNull(), // YouTube channel ID
    platform: text("platform").notNull(), // 'youtube', 'twitch', etc.
    metadataJson: jsonb("metadata_json").$type<CreatorMetadata>(),
    // Reference to auth service user - NOT a foreign key
    ownerUserId: text("owner_user_id"),
    isTakenDown: boolean("is_taken_down").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("creators_platform_platform_id_unique").on(
      table.platform,
      table.platformId,
    ),
    index("creators_platform_id_idx").on(table.platformId),
  ],
);

/**
 * Creator-Game associations
 */
export const creatorGames = pgTable(
  "creator_games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .references(() => creators.id, { onDelete: "cascade" })
      .notNull(),
    gameId: uuid("game_id")
      .references(() => games.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("creator_games_creator_game_unique").on(
      table.creatorId,
      table.gameId,
    ),
    index("creator_games_creator_id_idx").on(table.creatorId),
    index("creator_games_game_id_idx").on(table.gameId),
  ],
);

/**
 * Creator social media links
 */
export const creatorSocials = pgTable(
  "creator_socials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .references(() => creators.id, { onDelete: "cascade" })
      .notNull(),
    platform: text("platform").notNull(),
    channelId: text("channel_id"),
    handle: text("handle"),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("creator_socials_creator_platform_unique").on(
      table.creatorId,
      table.platform,
    ),
    index("creator_socials_creator_id_idx").on(table.creatorId),
  ],
);

// Relations
export const creatorsRelations = relations(creators, ({ many }) => ({
  games: many(creatorGames),
  socials: many(creatorSocials),
}));

export const creatorGamesRelations = relations(creatorGames, ({ one }) => ({
  creator: one(creators, {
    fields: [creatorGames.creatorId],
    references: [creators.id],
  }),
  game: one(games, {
    fields: [creatorGames.gameId],
    references: [games.id],
  }),
}));

export const creatorSocialsRelations = relations(creatorSocials, ({ one }) => ({
  creator: one(creators, {
    fields: [creatorSocials.creatorId],
    references: [creators.id],
  }),
}));

// Type exports
export type Creator = typeof creators.$inferSelect;
export type NewCreator = typeof creators.$inferInsert;
export type CreatorGame = typeof creatorGames.$inferSelect;
export type NewCreatorGame = typeof creatorGames.$inferInsert;
export type CreatorSocial = typeof creatorSocials.$inferSelect;
export type NewCreatorSocial = typeof creatorSocials.$inferInsert;
