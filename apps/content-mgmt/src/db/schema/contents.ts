import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { creators } from "./creators";
import { contentStatusEnum, sourceTypeEnum } from "./enums";
import { games } from "./games";

/**
 * YouTube metadata interface
 */
export interface YouTubeMetadata {
  authorName: string;
  channelName: string;
  channelId: string;
  channelUrl: string;
  durationSeconds: number;
  publishedAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  thumbnailUrl?: string;
  description?: string;
  timestampsInDescription?: { timestamp: string; title: string }[];
}

/**
 * Article metadata interface
 */
export interface ArticleMetadata {
  authorName?: string;
  siteName?: string;
  siteUrl?: string;
  publishedAt?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
  imageUrl?: string;
  description?: string;
  tags?: string[];
}

/**
 * Content metadata - union of all source-specific metadata types
 */
export type ContentMetadataJson = YouTubeMetadata | ArticleMetadata | Record<string, unknown>;

/**
 * Contents table - Content-agnostic storage for videos, articles, etc.
 */
export const contents = pgTable(
  "contents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    externalId: text("external_id").notNull(), // YouTube video ID, article URL, etc.
    url: text("url").notNull(),
    title: text("title").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    metadataJson: jsonb("metadata_json").$type<ContentMetadataJson>().notNull(),
    // Reference to auth service user - NOT a foreign key
    userId: text("user_id").notNull(),
    creatorId: uuid("creator_id").references(() => creators.id),
    gameId: uuid("game_id").references(() => games.id),
    status: contentStatusEnum("status").default("pending").notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    baitRating: integer("bait_rating"),
    hotness: doublePrecision("hotness"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => [
    unique("contents_source_external_unique").on(table.sourceType, table.externalId),
    index("contents_source_external_idx").on(table.sourceType, table.externalId),
    index("contents_created_at_idx").on(table.createdAt),
    index("contents_published_at_idx").on(table.publishedAt),
    index("contents_game_id_created_at_idx").on(table.gameId, table.createdAt),
    index("contents_hotness_idx").on(table.hotness),
    index("contents_status_idx").on(table.status),
    index("contents_source_type_idx").on(table.sourceType),
    index("contents_creator_id_idx").on(table.creatorId),
    index("contents_user_id_idx").on(table.userId),
  ],
);

// Relations
export const contentsRelations = relations(contents, ({ one }) => ({
  creator: one(creators, {
    fields: [contents.creatorId],
    references: [creators.id],
  }),
  game: one(games, {
    fields: [contents.gameId],
    references: [games.id],
  }),
}));

// Type exports
export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
