/**
 * Postprocessing Service
 *
 * Handles the postprocessing stage of the content ingestion pipeline.
 * Stores final summaries, extracts tags, links creators, and calculates ranking.
 *
 * IMPORTANT: Summaries are only stored in content_summaries after this stage completes.
 */

import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../../db/schema";
import {
  contentSummaries,
  contentTags,
  contents,
  postprocessingCache,
  tags,
} from "../../db/schema";
import type {
  AssignedTag,
  PostprocessingResult,
  PostprocessingStatus,
  ProcessingResult,
} from "../../types/ingestion-pipeline";

/**
 * Postprocessing cache data structure
 */
interface PostprocessingCacheData {
  tags: AssignedTag[];
  creatorId?: string;
  hotnessScore: number;
  baitRating: number;
}

/**
 * Options for postprocessing
 */
export interface PostprocessingOptions {
  /** Force re-postprocessing even if cached */
  forceRefresh?: boolean;
  /** Game ID to associate with content */
  gameId?: string;
}

/**
 * Postprocessing Service
 *
 * Manages the postprocessing stage - the final stage that stores summaries.
 */
export class PostprocessingService {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Postprocess content
   *
   * @param contentId - The content ID in the database
   * @param processing - Processing result with summaries
   * @param options - Postprocessing options
   * @returns Postprocessing result
   */
  async postprocess(
    contentId: string,
    processing: ProcessingResult,
    options: PostprocessingOptions = {},
  ): Promise<PostprocessingResult> {
    // Check cache if not forcing refresh
    if (!options.forceRefresh) {
      const cached = await this.getFromCache(contentId);
      if (cached && cached.status === "completed") {
        return this.createResultFromCache(contentId, cached);
      }
    }

    try {
      // Extract tags from themes and entities
      const assignedTags = await this.extractAndAssignTags(contentId, processing, options.gameId);

      // Calculate hotness score
      const hotnessScore = this.calculateHotness(processing);

      // Get bait rating from overview
      const baitRating = processing.overview.clickbaitRating.score;

      // Store summaries in content_summaries table
      await this.storeSummaries(contentId, processing);

      // Update content status to completed
      await this.updateContentStatus(contentId, hotnessScore, baitRating);

      const result: PostprocessingResult = {
        baitRating,
        blocked: false,
        contentId,
        hotnessScore,
        success: true,
        tags: assignedTags,
      };

      // Store in cache
      await this.storeInCache(contentId, result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Postprocessing failed";

      // Store failed result
      await this.storeFailedInCache(contentId, errorMessage);

      return {
        baitRating: 1,
        blocked: false,
        contentId,
        errorCode: "POSTPROCESSING_FAILED",
        errorMessage,
        hotnessScore: 0,
        success: false,
        tags: [],
      };
    }
  }

  /**
   * Extract and assign tags from processing result
   */
  private async extractAndAssignTags(
    contentId: string,
    processing: ProcessingResult,
    gameId?: string,
  ): Promise<AssignedTag[]> {
    const assignedTags: AssignedTag[] = [];

    // Extract tags from main themes
    for (const theme of processing.overview.mainThemes) {
      const slug = this.slugify(theme.title);
      const tag: AssignedTag = {
        appliedBy: "ai",
        category: "topic",
        confidence: theme.relevance,
        name: theme.title,
        slug,
      };

      // Try to find existing tag or create new one
      const existingTag = await this.findOrCreateTag(tag.name, tag.slug, tag.category, gameId);

      if (existingTag) {
        tag.tagId = existingTag.id;
      }

      assignedTags.push(tag);
    }

    // Add content category as a tag
    const categoryTag: AssignedTag = {
      appliedBy: "ai",
      category: "content_type",
      confidence: 1,
      name: this.formatCategory(processing.overview.contentCategory),
      slug: processing.overview.contentCategory,
    };

    const existingCategoryTag = await this.findOrCreateTag(
      categoryTag.name,
      categoryTag.slug,
      categoryTag.category,
      gameId,
    );

    if (existingCategoryTag) {
      categoryTag.tagId = existingCategoryTag.id;
    }

    assignedTags.push(categoryTag);

    // Store tag associations
    await this.storeContentTags(contentId, assignedTags);

    return assignedTags;
  }

  /**
   * Find or create a tag
   */
  private async findOrCreateTag(
    name: string,
    slug: string,
    category: string,
    gameId?: string,
  ): Promise<{ id: string } | null> {
    // Try to find existing tag - select usageCount for increment
    const [existing] = await this.db
      .select({ id: tags.id, usageCount: tags.usageCount })
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);

    if (existing) {
      // Increment usage count
      await this.db
        .update(tags)
        .set({
          usageCount: (existing.usageCount ?? 0) + 1,
        })
        .where(eq(tags.id, existing.id));

      return { id: existing.id };
    }

    // Create new tag
    try {
      const [created] = await this.db
        .insert(tags)
        .values({
          category,
          gameId,
          isActive: true,
          name,
          slug,
          usageCount: 1,
        })
        .returning({ id: tags.id });

      return created;
    } catch {
      // Tag might have been created by another process
      const [retryExisting] = await this.db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, slug))
        .limit(1);

      return retryExisting ?? null;
    }
  }

  /**
   * Store content-tag associations
   */
  private async storeContentTags(contentId: string, assignedTags: AssignedTag[]): Promise<void> {
    // Delete existing tags for this content
    await this.db.delete(contentTags).where(eq(contentTags.contentId, contentId));

    // Insert new tags
    const tagsToInsert = assignedTags
      .filter((tag) => tag.tagId)
      .map((tag) => ({
        appliedBy: tag.appliedBy,
        confidence: tag.confidence,
        contentId,
        tagId: tag.tagId!,
      }));

    if (tagsToInsert.length > 0) {
      await this.db.insert(contentTags).values(tagsToInsert);
    }
  }

  /**
   * Store summaries in content_summaries table
   */
  private async storeSummaries(contentId: string, processing: ProcessingResult): Promise<void> {
    // Delete existing summaries for this content
    await this.db.delete(contentSummaries).where(eq(contentSummaries.contentId, contentId));

    // Prepare summaries to insert
    const summariesToInsert = [];

    // Add general summary from overview
    summariesToInsert.push({
      contentId,
      detailed: processing.overview.fullOverview,
      modelId: processing.modelId,
      provider: processing.provider,
      short: processing.overview.shortOverview,
      summaryType: "general" as const,
    });

    // Add enhanced summaries
    for (const enhanced of processing.enhancedSummaries) {
      // Only store list format summaries (to avoid duplicates)
      if (enhanced.format === "list") {
        summariesToInsert.push({
          contentId,
          detailed: enhanced.detailed,
          modelId: processing.modelId,
          provider: processing.provider,
          short: enhanced.short,
          summaryType: enhanced.summaryType as
            | "general"
            | "insightful"
            | "funny"
            | "actionable"
            | "controversial",
        });
      }
    }

    // Insert summaries
    if (summariesToInsert.length > 0) {
      await this.db.insert(contentSummaries).values(summariesToInsert);
    }
  }

  /**
   * Update content status to completed
   */
  private async updateContentStatus(
    contentId: string,
    hotnessScore: number,
    baitRating: number,
  ): Promise<void> {
    await this.db
      .update(contents)
      .set({
        baitRating,
        hotness: hotnessScore,
        status: "completed",
      })
      .where(eq(contents.id, contentId));
  }

  /**
   * Calculate hotness score (Lobsters-style algorithm)
   */
  private calculateHotness(processing: ProcessingResult): number {
    // Base score from content category
    const categoryModifiers: Record<string, number> = {
      crafting: 1,
      discussion: 0,
      gameplay: 0,
      how_to: 2,
      market: 1,
      news: 0,
      other: -1,
      review: 0,
      tutorial: 2,
    };

    const base = categoryModifiers[processing.overview.contentCategory] ?? 0;

    // Initial order (no votes yet)
    const order = Math.log10(1);

    // Age component (current time)
    const HOTNESS_WINDOW_SECONDS = 7200; // 2 hours
    const age = Date.now() / 1000 / HOTNESS_WINDOW_SECONDS;

    // Hotness formula: -1 × (base + order + age)
    // Lower = higher rank (ascending sort)
    return -1 * (base + order + age);
  }

  /**
   * Get postprocessing result from cache
   */
  async getFromCache(contentId: string): Promise<{
    status: PostprocessingStatus;
    data?: PostprocessingCacheData;
  } | null> {
    const [cached] = await this.db
      .select()
      .from(postprocessingCache)
      .where(eq(postprocessingCache.contentId, contentId))
      .limit(1);

    if (!cached) {
      return null;
    }

    return {
      data: cached.contentJson as PostprocessingCacheData,
      status: cached.status as PostprocessingStatus,
    };
  }

  /**
   * Store postprocessing result in cache
   */
  private async storeInCache(contentId: string, result: PostprocessingResult): Promise<void> {
    const cacheData: PostprocessingCacheData = {
      baitRating: result.baitRating,
      creatorId: result.creatorId,
      hotnessScore: result.hotnessScore,
      tags: result.tags,
    };

    await this.db
      .insert(postprocessingCache)
      .values({
        contentId,
        contentJson: cacheData,
        status: "completed",
      })
      .onConflictDoUpdate({
        set: {
          contentJson: cacheData,
          createdAt: new Date(),
          status: "completed",
        },
        target: postprocessingCache.contentId,
      });
  }

  /**
   * Store failed postprocessing in cache
   */
  private async storeFailedInCache(contentId: string, errorMessage: string): Promise<void> {
    await this.db
      .insert(postprocessingCache)
      .values({
        contentId,
        contentJson: {
          baitRating: 1,
          hotnessScore: 0,
          tags: [],
        },
        status: "failed",
      })
      .onConflictDoUpdate({
        set: {
          createdAt: new Date(),
          status: "failed",
        },
        target: postprocessingCache.contentId,
      });
  }

  /**
   * Create result from cached data
   */
  private createResultFromCache(
    contentId: string,
    cached: { data?: PostprocessingCacheData },
  ): PostprocessingResult {
    const data = cached.data!;

    return {
      baitRating: data.baitRating,
      blocked: false,
      contentId,
      creatorId: data.creatorId,
      hotnessScore: data.hotnessScore,
      success: true,
      tags: data.tags,
    };
  }

  /**
   * Convert string to slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /**
   * Format category for display
   */
  private formatCategory(category: string): string {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

/**
 * Create a postprocessing service instance
 */
export function createPostprocessingService(
  db: PostgresJsDatabase<typeof schema>,
): PostprocessingService {
  return new PostprocessingService(db);
}
