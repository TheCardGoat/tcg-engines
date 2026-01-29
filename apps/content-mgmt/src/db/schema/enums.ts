import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Content source type enum
 */
export const sourceTypeEnum = pgEnum("source_type", ["youtube"]);

/**
 * Content processing status enum
 */
export const contentStatusEnum = pgEnum("content_status", [
  "pending",
  "processing",
  "completed",
  "failed",
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
]);

/**
 * Processing status enum for AI processing pipeline
 */
export const processingStatusEnum = pgEnum("processing_status", [
  "processing",
  "completed",
  "failed",
]);
