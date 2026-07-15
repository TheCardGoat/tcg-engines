/**
 * Cache Tables Schema
 *
 * Defines cache tables for the content ingestion pipeline stages:
 * - extraction_cache: Raw content from extraction services
 * - preprocessing_cache: Entities, themes, segments from AI preprocessing
 * - processing_cache: Generated summaries from AI processing
 * - postprocessing_cache: Tags, creator links, ranking data
 */

import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contents } from "./contents";
import {
  extractionStatusEnum,
  postprocessingStatusEnum,
  preprocessingStatusEnum,
  processingStatusEnum,
} from "./enums";
import { games } from "./games";

/**
 * Extraction cache data structure
 */
interface ExtractionCacheData {
  /** Raw text content (transcript, article body, etc.) */
  textContent: string;
  /** Content segments with timestamps */
  segments?: {
    text: string;
    offsetMs: number;
    durationMs: number;
    language?: string;
  }[];
  /** Extracted metadata */
  metadata: {
    title: string;
    description?: string;
    authorName?: string;
    channelName?: string;
    channelId?: string;
    channelUrl?: string;
    durationSeconds?: number;
    contentLength?: number;
    publishedAt?: string;
    thumbnailUrl?: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    language?: string;
    sourceMetadata: Record<string, unknown>;
  };
  /** Language of the content */
  language?: string;
  /** Available languages */
  availableLanguages?: string[];
}

/**
 * Preprocessing cache data structure
 */
interface PreprocessingCacheData {
  /** Extracted entities */
  entities: {
    name: string;
    type: string;
    confidence: number;
    mentionCount: number;
    contexts?: string[];
  }[];
  /** Identified themes */
  themes: {
    title: string;
    description: string;
    relevance: number;
  }[];
  /** Analyzed segments */
  segments: {
    index: number;
    startOffset: number;
    endOffset: number;
    summary: string;
    topics: string[];
    entityMentions: string[];
  }[];
  /** Whether content is game-related */
  isGameRelated: boolean;
}

/**
 * Processing cache data structure
 */
interface ProcessingCacheData {
  /** Overview summary */
  overview: {
    logline: string;
    fullOverview: string;
    shortOverview: string;
    clickbaitRating: {
      score: number;
      explanation: string;
    };
    mainThemes: {
      title: string;
      description: string;
      relevance: number;
    }[];
    contentCategory: string;
  };
  /** Enhanced summaries (4 tones × 2 formats) */
  enhancedSummaries: {
    summaryType: string;
    format: string;
    short: string;
    detailed: string;
  }[];
}

/**
 * Postprocessing cache data structure
 */
interface PostprocessingCacheData {
  /** Assigned tags */
  tags: {
    tagId?: string;
    name: string;
    slug: string;
    category: string;
    confidence: number;
    appliedBy: "ai" | "user" | "admin";
  }[];
  /** Creator ID if identified */
  creatorId?: string;
  /** Calculated hotness score */
  hotnessScore: number;
  /** Bait rating from overview */
  baitRating: number;
}

/**
 * Extraction Cache Table
 *
 * Stores raw content fetched from extraction services (Supadata, Tabstack, etc.)
 */
export const extractionCache = pgTable(
  "extraction_cache",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    contentId: uuid("content_id")
      .notNull()
      .unique()
      .references(() => contents.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    contentJson: jsonb("content_json").$type<ExtractionCacheData>().notNull(),
    gameId: uuid("game_id").references(() => games.id),
    fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
    provider: text("provider").notNull(), // 'supadata', 'tabstack', etc.
    status: extractionStatusEnum("status").default("complete").notNull(),
    errorMessage: text("error_message"),
  },
  (table) => [
    index("extraction_cache_game_id_idx").on(table.gameId),
    index("extraction_cache_status_idx").on(table.status),
    index("extraction_cache_provider_idx").on(table.provider),
  ],
);

/**
 * Preprocessing Cache Table
 *
 * Stores AI-extracted entities, themes, and segments
 */
export const preprocessingCache = pgTable(
  "preprocessing_cache",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    contentId: uuid("content_id")
      .notNull()
      .unique()
      .references(() => contents.id, { onDelete: "cascade" }),
    contentJson: jsonb("content_json").$type<PreprocessingCacheData>().notNull(),
    status: preprocessingStatusEnum("status").default("complete").notNull(),
    provider: text("provider").notNull(), // AI provider
    modelId: text("model_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    errorMessage: text("error_message"),
  },
  (table) => [
    index("preprocessing_cache_status_idx").on(table.status),
    index("preprocessing_cache_provider_idx").on(table.provider),
  ],
);

/**
 * Processing Cache Table
 *
 * Stores AI-generated summaries
 */
export const processingCache = pgTable(
  "processing_cache",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    contentId: uuid("content_id")
      .notNull()
      .unique()
      .references(() => contents.id, { onDelete: "cascade" }),
    contentJson: jsonb("content_json").$type<ProcessingCacheData>().notNull(),
    status: processingStatusEnum("status").default("completed").notNull(),
    processingStartedAt: timestamp("processing_started_at"),
    provider: text("provider").notNull(), // AI provider
    modelId: text("model_id").notNull(),
    creatorArchetype: text("creator_archetype"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("processing_cache_content_id_status_idx").on(table.contentId, table.status),
    index("processing_cache_status_idx").on(table.status),
    index("processing_cache_provider_idx").on(table.provider),
  ],
);

/**
 * Postprocessing Cache Table
 *
 * Stores tags, creator links, and ranking data
 */
export const postprocessingCache = pgTable(
  "postprocessing_cache",
  {
    contentId: uuid("content_id")
      .notNull()
      .unique()
      .references(() => contents.id, { onDelete: "cascade" }),
    contentJson: jsonb("content_json").$type<PostprocessingCacheData>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    status: postprocessingStatusEnum("status").default("completed").notNull(),
  },
  (table) => [index("postprocessing_cache_status_idx").on(table.status)],
);

// Type exports
export type ExtractionCache = typeof extractionCache.$inferSelect;
export type NewExtractionCache = typeof extractionCache.$inferInsert;
export type PreprocessingCache = typeof preprocessingCache.$inferSelect;
export type NewPreprocessingCache = typeof preprocessingCache.$inferInsert;
export type ProcessingCache = typeof processingCache.$inferSelect;
export type NewProcessingCache = typeof processingCache.$inferInsert;
export type PostprocessingCache = typeof postprocessingCache.$inferSelect;
export type NewPostprocessingCache = typeof postprocessingCache.$inferInsert;
