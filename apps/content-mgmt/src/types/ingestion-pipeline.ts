/**
 * Ingestion Pipeline Types
 *
 * Defines types for the content ingestion pipeline stages:
 * extraction → preprocessing → processing → postprocessing
 */

import type {
  ContentMetadata,
  ExtractionResult,
  RawContent,
  SourceType,
} from "./extraction-service";

/**
 * Pipeline stage identifiers
 */
export type PipelineStage =
  | "extraction"
  | "preprocessing"
  | "processing"
  | "postprocessing";

/**
 * Status values for each pipeline stage
 */
export type ExtractionStatus =
  | "pending"
  | "partial"
  | "complete"
  | "failed"
  | "blocked";
export type PreprocessingStatus = "pending" | "complete" | "failed" | "blocked";
export type ProcessingStatus =
  | "processing"
  | "completed"
  | "failed"
  | "blocked";
export type PostprocessingStatus = "pending" | "completed" | "failed";

/**
 * Content status (overall status in contents table)
 */
export type ContentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "blocked";

/**
 * Base interface for all pipeline stage results
 */
export interface PipelineStageResult {
  /** Content ID in the database */
  contentId: string;
  /** Whether this stage was successful */
  success: boolean;
  /** Whether content should be blocked */
  blocked: boolean;
  /** Error message if failed or blocked */
  errorMessage?: string;
  /** Error code for programmatic handling */
  errorCode?: string;
}

/**
 * Preprocessing result - entities, themes, and segments
 */
export interface PreprocessingResult extends PipelineStageResult {
  /** Extracted entities (characters, items, locations, etc.) */
  entities: ExtractedEntity[];
  /** Identified themes */
  themes: ExtractedTheme[];
  /** Content segments with analysis */
  segments: AnalyzedSegment[];
  /** Whether content is game-related */
  isGameRelated: boolean;
  /** AI provider used */
  provider: string;
  /** AI model used */
  modelId: string;
}

/**
 * Extracted entity from content
 */
export interface ExtractedEntity {
  /** Entity name */
  name: string;
  /** Entity type (character, item, location, etc.) */
  type: EntityType;
  /** Confidence score (0-1) */
  confidence: number;
  /** Number of mentions */
  mentionCount: number;
  /** Context snippets where entity appears */
  contexts?: string[];
}

/**
 * Entity types for game content
 */
export type EntityType =
  | "character"
  | "item"
  | "location"
  | "ability"
  | "game_mode"
  | "mechanic"
  | "creator"
  | "other";

/**
 * Extracted theme from content
 */
export interface ExtractedTheme {
  /** Theme title (3-4 words) */
  title: string;
  /** Theme description (1-2 sentences) */
  description: string;
  /** Relevance score (0-1) */
  relevance: number;
}

/**
 * Analyzed content segment
 */
export interface AnalyzedSegment {
  /** Segment index */
  index: number;
  /** Start time in seconds (for video) or character offset (for text) */
  startOffset: number;
  /** End time in seconds (for video) or character offset (for text) */
  endOffset: number;
  /** Segment summary */
  summary: string;
  /** Key topics in this segment */
  topics: string[];
  /** Entities mentioned in this segment */
  entityMentions: string[];
}

/**
 * Processing result - all generated summaries
 */
export interface ProcessingResult extends PipelineStageResult {
  /** Overview summary */
  overview: OverviewSummary;
  /** Enhanced summaries (4 tones × 2 formats) */
  enhancedSummaries: EnhancedSummary[];
  /** AI provider used */
  provider: string;
  /** AI model used */
  modelId: string;
}

/**
 * Overview summary with comprehensive analysis
 */
export interface OverviewSummary {
  /** Engaging 15-30 word summary with markdown */
  logline: string;
  /** Comprehensive 3-5 sentence overview */
  fullOverview: string;
  /** 1-2 sentence essence */
  shortOverview: string;
  /** Clickbait rating */
  clickbaitRating: ClickbaitRating;
  /** Main themes */
  mainThemes: ExtractedTheme[];
  /** Content category */
  contentCategory: ContentCategory;
}

/**
 * Clickbait rating assessment
 */
export interface ClickbaitRating {
  /** Score from 1-5 */
  score: number;
  /** Explanation for the rating */
  explanation: string;
}

/**
 * Content categories
 */
export type ContentCategory =
  | "tutorial"
  | "gameplay"
  | "crafting"
  | "market"
  | "news"
  | "discussion"
  | "review"
  | "how_to"
  | "other";

/**
 * Enhanced summary with specific tone
 */
export interface EnhancedSummary {
  /** Summary type/tone */
  summaryType: SummaryType;
  /** Summary format */
  format: SummaryFormat;
  /** Short summary (2-3 sentences) */
  short: string;
  /** Detailed summary (list or Q&A format) */
  detailed: string;
}

/**
 * Summary types (tones)
 */
export type SummaryType =
  | "general"
  | "insightful"
  | "funny"
  | "actionable"
  | "controversial";

/**
 * Summary formats
 */
export type SummaryFormat = "list" | "qa";

/**
 * Postprocessing result - tags, creator links, ranking
 */
export interface PostprocessingResult extends PipelineStageResult {
  /** Extracted/assigned tags */
  tags: AssignedTag[];
  /** Creator link (if identified) */
  creatorId?: string;
  /** Calculated hotness score */
  hotnessScore: number;
  /** Bait rating (from overview) */
  baitRating: number;
}

/**
 * Tag assigned to content
 */
export interface AssignedTag {
  /** Tag ID (if existing tag) */
  tagId?: string;
  /** Tag name */
  name: string;
  /** Tag slug */
  slug: string;
  /** Tag category */
  category: TagCategory;
  /** Confidence score (0-1) */
  confidence: number;
  /** How the tag was applied */
  appliedBy: "ai" | "user" | "admin";
}

/**
 * Tag categories
 */
export type TagCategory =
  | "content_type"
  | "character"
  | "character_class"
  | "game_mode"
  | "topic"
  | "item_type";

/**
 * Full pipeline result combining all stages
 */
export interface PipelineResult {
  /** Content ID */
  contentId: string;
  /** Source type */
  sourceType: SourceType;
  /** Overall success */
  success: boolean;
  /** Whether content is blocked */
  blocked: boolean;
  /** Stage where blocking occurred (if blocked) */
  blockedAtStage?: PipelineStage;
  /** Blocking reason */
  blockReason?: string;
  /** Extraction result */
  extraction?: ExtractionResult;
  /** Preprocessing result */
  preprocessing?: PreprocessingResult;
  /** Processing result */
  processing?: ProcessingResult;
  /** Postprocessing result */
  postprocessing?: PostprocessingResult;
}

/**
 * Pipeline execution options
 */
export interface PipelineOptions {
  /** Force reprocessing even if cached */
  forceRefresh?: boolean;
  /** Skip specific stages (for partial reprocessing) */
  skipStages?: PipelineStage[];
  /** Timeout overrides per stage */
  timeouts?: Partial<Record<PipelineStage, number>>;
  /** Game ID to associate with content */
  gameId?: string;
}

/**
 * Cache entry for extraction stage
 */
export interface ExtractionCacheEntry {
  contentId: string;
  url: string;
  contentJson: RawContent & { metadata: ContentMetadata };
  gameId?: string;
  fetchedAt: Date;
  provider: string;
  status: ExtractionStatus;
  errorMessage?: string;
}

/**
 * Cache entry for preprocessing stage
 */
export interface PreprocessingCacheEntry {
  contentId: string;
  contentJson: Omit<
    PreprocessingResult,
    "contentId" | "success" | "blocked" | "errorMessage" | "errorCode"
  >;
  status: PreprocessingStatus;
  provider: string;
  modelId: string;
  createdAt: Date;
  errorMessage?: string;
}

/**
 * Cache entry for processing stage
 */
export interface ProcessingCacheEntry {
  contentId: string;
  contentJson: Omit<
    ProcessingResult,
    "contentId" | "success" | "blocked" | "errorMessage" | "errorCode"
  >;
  status: ProcessingStatus;
  provider: string;
  modelId: string;
  createdAt: Date;
  errorMessage?: string;
}

/**
 * Cache entry for postprocessing stage
 */
export interface PostprocessingCacheEntry {
  contentId: string;
  contentJson: Omit<
    PostprocessingResult,
    "contentId" | "success" | "blocked" | "errorMessage" | "errorCode"
  >;
  status: PostprocessingStatus;
  createdAt: Date;
}

/**
 * Errors that should block content (permanent rejection)
 */
export const BLOCKING_ERROR_CODES = [
  "CONTENT_VALIDATION_ERROR",
  "CONTENT_TOO_LONG",
  "UNSUPPORTED_LANGUAGE",
  "NON_GAME_CONTENT",
  "POLICY_VIOLATION",
  "INVALID_CONTENT_TYPE",
] as const;

/**
 * Errors that can be retried
 */
export const RETRIABLE_ERROR_CODES = [
  "TIMEOUT_ERROR",
  "AI_GENERATION_ERROR",
  "TRANSCRIPT_FETCH_ERROR",
  "RATE_LIMIT_ERROR",
  "PROVIDER_UNAVAILABLE",
] as const;

export type BlockingErrorCode = (typeof BLOCKING_ERROR_CODES)[number];
export type RetriableErrorCode = (typeof RETRIABLE_ERROR_CODES)[number];
