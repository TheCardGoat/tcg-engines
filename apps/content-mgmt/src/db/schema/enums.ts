import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Content source type enum
 * Identifies the extraction service used for the content
 */
export const sourceTypeEnum = pgEnum("source_type", [
  "youtube",
  "article",
  "rss",
  "http",
]);

/**
 * Content processing status enum
 * Overall status of content in the pipeline
 */
export const contentStatusEnum = pgEnum("content_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "blocked",
]);

/**
 * Summary type enum for different summary styles
 */
export const summaryTypeEnum = pgEnum("summary_type", [
  "general",
  "insightful",
  "funny",
  "actionable",
  "controversial",
]);

/**
 * Extraction status enum for content extraction pipeline
 */
export const extractionStatusEnum = pgEnum("extraction_status", [
  "pending",
  "partial",
  "complete",
  "failed",
  "blocked",
]);

/**
 * Preprocessing status enum for AI preprocessing pipeline
 */
export const preprocessingStatusEnum = pgEnum("preprocessing_status", [
  "pending",
  "complete",
  "failed",
  "blocked",
]);

/**
 * Processing status enum for AI processing pipeline
 */
export const processingStatusEnum = pgEnum("processing_status", [
  "processing",
  "completed",
  "failed",
  "blocked",
]);

/**
 * Postprocessing status enum for final pipeline stage
 */
export const postprocessingStatusEnum = pgEnum("postprocessing_status", [
  "pending",
  "completed",
  "failed",
]);
