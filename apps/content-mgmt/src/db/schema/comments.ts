import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contents } from "./contents";

/**
 * Comments table - Hierarchical comments on content
 */
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentId: uuid("content_id")
      .references(() => contents.id, { onDelete: "cascade" })
      .notNull(),
    // Reference to auth service user - NOT a foreign key
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"),
    content: text("content").notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_content_id_idx").on(table.contentId),
    index("comments_parent_id_idx").on(table.parentId),
    index("comments_content_parent_idx").on(table.contentId, table.parentId),
    index("comments_user_id_idx").on(table.userId),
  ],
);

// Self-referential relation for parent comment
// Note: Drizzle requires explicit typing for self-referential relations
export const commentsRelations = relations(comments, ({ one }) => ({
  content: one(contents, {
    fields: [comments.contentId],
    references: [contents.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "parentChild",
  }),
}));

// Type exports
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
