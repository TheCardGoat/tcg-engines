/**
 * Content Summaries Schema
 *
 * Stores final AI-generated summaries after postprocessing completes.
 * Summaries are only stored here after the full pipeline succeeds.
 */

import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { contents } from "./contents";
import { summaryTypeEnum } from "./enums";

/**
 * Content Summaries Table
 *
 * Stores the final summaries for content that has completed the full pipeline.
 * Each content can have multiple summaries of different types.
 */
export const contentSummaries = pgTable(
  "content_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentId: uuid("content_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    summaryType: summaryTypeEnum("summary_type").notNull(),
    short: text("short").notNull(),
    detailed: text("detailed").notNull(),
    provider: text("provider").notNull(),
    modelId: text("model_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("content_summaries_content_type_unique").on(
      table.contentId,
      table.summaryType,
    ),
    index("content_summaries_content_id_idx").on(table.contentId),
    index("content_summaries_summary_type_idx").on(table.summaryType),
  ],
);

// Relations
export const contentSummariesRelations = relations(
  contentSummaries,
  ({ one }) => ({
    content: one(contents, {
      fields: [contentSummaries.contentId],
      references: [contents.id],
    }),
  }),
);

// Type exports
export type ContentSummary = typeof contentSummaries.$inferSelect;
export type NewContentSummary = typeof contentSummaries.$inferInsert;
