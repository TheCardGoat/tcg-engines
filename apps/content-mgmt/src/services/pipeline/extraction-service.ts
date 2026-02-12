/**
 * Extraction Service
 *
 * Handles the extraction stage of the content ingestion pipeline.
 * Manages cache, coordinates with extraction adapters, and handles blocking.
 */

import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../../db/schema";
import { contents, extractionCache } from "../../db/schema";
import type { ContentMetadata, ExtractionResult, RawContent } from "../../types/extraction-service";
import type { ExtractionStatus } from "../../types/ingestion-pipeline";
import { type ExtractionServiceAdapter, extractionServiceRegistry } from "../extraction";

/**
 * Extraction cache data structure (matches database schema)
 */
interface ExtractionCacheData {
  sourceType: "youtube" | "article" | "rss" | "http";
  textContent: string;
  segments?: {
    text: string;
    offsetMs: number;
    durationMs: number;
    language?: string;
  }[];
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
  language?: string;
  availableLanguages?: string[];
}

/**
 * Options for extraction
 */
export interface ExtractionOptions {
  /** Force re-extraction even if cached */
  forceRefresh?: boolean;
  /** Preferred language for content */
  preferredLanguage?: string;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** Game ID to associate with content */
  gameId?: string;
  /** User ID submitting the content */
  userId?: string;
}

/**
 * Extraction Service
 *
 * Manages the extraction stage with caching and blocking support.
 */
export class ExtractionService {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Extract content from a URL
   *
   * @param url - The URL to extract content from
   * @param options - Extraction options
   * @returns Extraction result
   */
  async extract(url: string, options: ExtractionOptions = {}): Promise<ExtractionResult> {
    // Find adapter for URL
    const adapter = extractionServiceRegistry.getAdapterForUrl(url);
    if (!adapter) {
      return this.createFailedResult(
        "",
        "unknown",
        `No extraction service available for URL: ${url}`,
        true,
      );
    }

    // Parse URL
    const parsed = adapter.parseUrl(url);
    if (!parsed) {
      return this.createFailedResult(
        "",
        adapter.serviceId,
        `Invalid URL format: ${url}`,
        true,
        adapter.supportedSourceTypes[0],
      );
    }

    const { sourceType, contentId, normalizedUrl } = parsed;

    // Check if content exists and is blocked
    const existingContent = await this.findExistingContent(sourceType, contentId);
    if (existingContent) {
      // Check if blocked
      if (existingContent.status === "blocked") {
        return this.createFailedResult(
          existingContent.id,
          adapter.serviceId,
          "Content is blocked",
          true,
          sourceType,
        );
      }

      // Check cache if not forcing refresh
      if (!options.forceRefresh) {
        const cached = await this.getFromCache(existingContent.id);
        if (cached && cached.status === "complete") {
          return this.createResultFromCache(existingContent.id, cached, adapter.serviceId);
        }
        if (cached && cached.status === "blocked") {
          return this.createFailedResult(
            existingContent.id,
            adapter.serviceId,
            cached.errorMessage ?? "Content is blocked",
            true,
            sourceType,
          );
        }
      }
    }

    // Create or get content record
    const dbContentId =
      existingContent?.id ??
      (await this.createContent(
        sourceType,
        contentId,
        normalizedUrl,
        options.userId ?? "system",
        options.gameId,
      ));

    // Perform extraction
    try {
      const result = await this.performExtraction(adapter, contentId, dbContentId, options);

      // Store in cache
      await this.storeInCache(
        dbContentId,
        normalizedUrl,
        result,
        adapter.serviceId,
        options.gameId,
      );

      // Update content status
      await this.updateContentStatus(
        dbContentId,
        result.validation.shouldBlock ? "blocked" : "processing",
      );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Extraction failed";
      const shouldBlock = this.shouldBlockOnError(error);

      // Store failed result in cache
      await this.storeFailedInCache(
        dbContentId,
        normalizedUrl,
        adapter.serviceId,
        errorMessage,
        shouldBlock,
        options.gameId,
      );

      // Update content status
      await this.updateContentStatus(dbContentId, shouldBlock ? "blocked" : "failed");

      return this.createFailedResult(
        dbContentId,
        adapter.serviceId,
        errorMessage,
        shouldBlock,
        sourceType,
      );
    }
  }

  /**
   * Check if content is blocked
   */
  async isBlocked(contentId: string): Promise<boolean> {
    const cached = await this.getFromCache(contentId);
    return cached?.status === "blocked";
  }

  /**
   * Get extraction result from cache
   */
  async getFromCache(contentId: string): Promise<{
    status: ExtractionStatus;
    data?: ExtractionCacheData;
    provider: string;
    errorMessage?: string;
  } | null> {
    const [cached] = await this.db
      .select()
      .from(extractionCache)
      .where(eq(extractionCache.contentId, contentId))
      .limit(1);

    if (!cached) {
      return null;
    }

    return {
      data: cached.contentJson as ExtractionCacheData,
      errorMessage: cached.errorMessage ?? undefined,
      provider: cached.provider,
      status: cached.status as ExtractionStatus,
    };
  }

  /**
   * Find existing content by source type and external ID
   */
  private async findExistingContent(
    sourceType: string,
    externalId: string,
  ): Promise<{ id: string; status: string } | null> {
    const [existing] = await this.db
      .select({ id: contents.id, status: contents.status })
      .from(contents)
      .where(
        and(
          eq(contents.externalId, externalId),
          eq(contents.sourceType, sourceType as "youtube" | "article" | "rss" | "http"),
        ),
      )
      .limit(1);

    return existing ?? null;
  }

  /**
   * Create a new content record
   */
  private async createContent(
    sourceType: string,
    externalId: string,
    url: string,
    userId: string,
    gameId?: string,
  ): Promise<string> {
    const [created] = await this.db
      .insert(contents)
      .values({
        sourceType: sourceType as "youtube" | "article" | "rss" | "http",
        externalId,
        url,
        title: "", // Will be updated after extraction
        metadataJson: {},
        userId,
        gameId,
        status: "pending",
      })
      .returning({ id: contents.id });

    return created.id;
  }

  /**
   * Update content status
   */
  private async updateContentStatus(
    contentId: string,
    status: "pending" | "processing" | "completed" | "failed" | "blocked",
  ): Promise<void> {
    await this.db.update(contents).set({ status }).where(eq(contents.id, contentId));
  }

  /**
   * Update content with extracted metadata
   */
  private async updateContentMetadata(contentId: string, metadata: ContentMetadata): Promise<void> {
    await this.db
      .update(contents)
      .set({
        metadataJson: metadata.sourceMetadata,
        publishedAt: metadata.publishedAt,
        thumbnailUrl: metadata.thumbnailUrl,
        title: metadata.title,
      })
      .where(eq(contents.id, contentId));
  }

  /**
   * Perform the actual extraction
   */
  private async performExtraction(
    adapter: ExtractionServiceAdapter,
    externalId: string,
    dbContentId: string,
    options: ExtractionOptions,
  ): Promise<ExtractionResult> {
    // Fetch raw content
    const rawContent = await adapter.fetchContent(externalId, {
      preferredLanguage: options.preferredLanguage,
      timeoutMs: options.timeoutMs,
    });

    // Extract metadata
    const metadata = await adapter.extractMetadata(rawContent);

    // Update content with metadata
    await this.updateContentMetadata(dbContentId, metadata);

    // Validate content
    const validation = await adapter.validateContent(metadata);

    return {
      contentId: dbContentId,
      errorMessage: validation.isValid
        ? undefined
        : validation.errors.map((e) => e.message).join("; "),
      metadata,
      provider: adapter.serviceId,
      rawContent,
      success: validation.isValid,
      validation,
    };
  }

  /**
   * Store extraction result in cache
   */
  private async storeInCache(
    contentId: string,
    url: string,
    result: ExtractionResult,
    provider: string,
    gameId?: string,
  ): Promise<void> {
    const cacheData: ExtractionCacheData = {
      availableLanguages: result.rawContent.availableLanguages,
      language: result.rawContent.language,
      metadata: {
        authorName: result.metadata.authorName,
        channelId: result.metadata.channelId,
        channelName: result.metadata.channelName,
        channelUrl: result.metadata.channelUrl,
        commentCount: result.metadata.commentCount,
        contentLength: result.metadata.contentLength,
        description: result.metadata.description,
        durationSeconds: result.metadata.durationSeconds,
        language: result.metadata.language,
        likeCount: result.metadata.likeCount,
        publishedAt: result.metadata.publishedAt?.toISOString(),
        sourceMetadata: result.metadata.sourceMetadata,
        thumbnailUrl: result.metadata.thumbnailUrl,
        title: result.metadata.title,
        viewCount: result.metadata.viewCount,
      },
      segments: result.rawContent.segments,
      sourceType: result.rawContent.sourceType,
      textContent: result.rawContent.textContent,
    };

    const status: ExtractionStatus = result.validation.shouldBlock
      ? "blocked"
      : (result.success
        ? "complete"
        : "failed");

    await this.db
      .insert(extractionCache)
      .values({
        contentId,
        contentJson: cacheData,
        errorMessage: result.errorMessage,
        gameId,
        provider,
        status,
        url,
      })
      .onConflictDoUpdate({
        set: {
          contentJson: cacheData,
          errorMessage: result.errorMessage,
          fetchedAt: new Date(),
          provider,
          status,
        },
        target: extractionCache.contentId,
      });
  }

  /**
   * Store failed extraction in cache
   */
  private async storeFailedInCache(
    contentId: string,
    url: string,
    provider: string,
    errorMessage: string,
    blocked: boolean,
    gameId?: string,
  ): Promise<void> {
    const status: ExtractionStatus = blocked ? "blocked" : "failed";

    await this.db
      .insert(extractionCache)
      .values({
        contentId,
        contentJson: {
          metadata: {
            sourceMetadata: {},
            title: "",
          },
          textContent: "",
        },
        errorMessage,
        gameId,
        provider,
        status,
        url,
      })
      .onConflictDoUpdate({
        set: {
          errorMessage,
          fetchedAt: new Date(),
          provider,
          status,
        },
        target: extractionCache.contentId,
      });
  }

  /**
   * Create result from cached data
   */
  private createResultFromCache(
    contentId: string,
    cached: {
      data?: ExtractionCacheData;
      provider: string;
    },
    provider: string,
  ): ExtractionResult {
    const data = cached.data!;

    return {
      contentId,
      metadata: {
        authorName: data.metadata.authorName,
        channelId: data.metadata.channelId,
        channelName: data.metadata.channelName,
        channelUrl: data.metadata.channelUrl,
        commentCount: data.metadata.commentCount,
        contentLength: data.metadata.contentLength,
        description: data.metadata.description,
        durationSeconds: data.metadata.durationSeconds,
        language: data.metadata.language,
        likeCount: data.metadata.likeCount,
        publishedAt: data.metadata.publishedAt ? new Date(data.metadata.publishedAt) : undefined,
        sourceMetadata: data.metadata.sourceMetadata,
        thumbnailUrl: data.metadata.thumbnailUrl,
        title: data.metadata.title,
        viewCount: data.metadata.viewCount,
      },
      provider,
      rawContent: {
        availableLanguages: data.availableLanguages,
        contentId,
        language: data.language,
        rawMetadata: data.metadata.sourceMetadata,
        segments: data.segments,
        sourceType: data.sourceType,
        textContent: data.textContent,
      },
      success: true,
      validation: {
        errors: [],
        isValid: true,
        shouldBlock: false,
      },
    };
  }

  /**
   * Create a failed extraction result
   */
  private createFailedResult(
    contentId: string,
    provider: string,
    errorMessage: string,
    shouldBlock: boolean,
    sourceType: "youtube" | "article" | "rss" | "http" = "youtube",
  ): ExtractionResult {
    return {
      contentId,
      errorMessage,
      metadata: {
        sourceMetadata: {},
        title: "",
      },
      provider,
      rawContent: {
        contentId,
        rawMetadata: {},
        sourceType,
        textContent: "",
      },
      success: false,
      validation: {
        errors: [
          {
            code: shouldBlock ? "CONTENT_BLOCKED" : "EXTRACTION_FAILED",
            message: errorMessage,
          },
        ],
        isValid: false,
        shouldBlock,
      },
    };
  }

  /**
   * Determine if an error should block the content
   */
  private shouldBlockOnError(error: unknown): boolean {
    if (error instanceof Error) {
      // Check for specific error types that should block
      const blockingPatterns = [
        /invalid.*url/i,
        /unsupported.*language/i,
        /content.*too.*long/i,
        /policy.*violation/i,
      ];

      return blockingPatterns.some((pattern) => pattern.test(error.message));
    }
    return false;
  }
}

/**
 * Create an extraction service instance
 */
export function createExtractionService(db: PostgresJsDatabase<typeof schema>): ExtractionService {
  return new ExtractionService(db);
}
