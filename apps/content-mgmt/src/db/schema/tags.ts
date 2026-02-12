import { relations } from "drizzle-orm";
import {
  boolean,
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
import { contents } from "./contents";
import { games } from "./games";

/**
 * Tag metadata interface
 */
interface TagMetadata {
  color?: string;
  icon?: string;
  aliases?: string[];
}

/**
 * Tag categories
 */
export const TAG_CATEGORIES = {
  CHARACTER: "character",
  CHARACTER_CLASS: "character_class",
  CONTENT_TYPE: "content_type",
  GAME_MODE: "game_mode",
  ITEM_TYPE: "item_type",
  TOPIC: "topic",
} as const;

/**
 * Tags table - Hierarchical tagging system
 */
export const tags = pgTable(
  "tags",
  {
    category: text("category").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    description: text("description"),
    gameId: uuid("game_id").references(() => games.id),
    id: uuid("id").primaryKey().defaultRandom(),
    isActive: boolean("is_active").default(true).notNull(),
    metadataJson: jsonb("metadata_json").$type<TagMetadata>(),
    name: text("name").notNull(),
    parentTagId: uuid("parent_tag_id"),
    slug: text("slug").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    usageCount: integer("usage_count").default(0).notNull(),
  },
  (table) => [
    unique("tags_game_slug_unique").on(table.gameId, table.slug),
    index("tags_game_id_idx").on(table.gameId),
    index("tags_category_idx").on(table.category),
    index("tags_parent_tag_id_idx").on(table.parentTagId),
    index("tags_usage_count_idx").on(table.usageCount),
  ],
);

/**
 * Content-Tag associations
 */
export const contentTags = pgTable(
  "content_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentId: uuid("content_id")
      .references(() => contents.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    // Use doublePrecision instead of JSONB for efficient numeric storage
    confidence: doublePrecision("confidence"),
    appliedBy: text("applied_by").$type<"user" | "ai" | "admin">(),
    appliedAt: timestamp("applied_at").defaultNow().notNull(),
  },
  (table) => [
    unique("content_tags_content_tag_unique").on(table.contentId, table.tagId),
    index("content_tags_content_id_idx").on(table.contentId),
    index("content_tags_tag_id_idx").on(table.tagId),
  ],
);

// Relations
export const tagsRelations = relations(tags, ({ one, many }) => ({
  contentTags: many(contentTags),
  game: one(games, {
    fields: [tags.gameId],
    references: [games.id],
  }),
  parent: one(tags, {
    fields: [tags.parentTagId],
    references: [tags.id],
    relationName: "parentChild",
  }),
}));

export const contentTagsRelations = relations(contentTags, ({ one }) => ({
  content: one(contents, {
    fields: [contentTags.contentId],
    references: [contents.id],
  }),
  tag: one(tags, {
    fields: [contentTags.tagId],
    references: [tags.id],
  }),
}));

// Type exports
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type ContentTag = typeof contentTags.$inferSelect;
export type NewContentTag = typeof contentTags.$inferInsert;
