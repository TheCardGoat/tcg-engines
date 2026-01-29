/**
 * Processing Service
 *
 * Handles the processing stage of the content ingestion pipeline.
 * Generates AI summaries in parallel (9 calls: 1 overview + 8 enhanced).
 */

import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../../db/schema";
import { processingCache } from "../../db/schema";
import type {
  EnhancedSummary,
  OverviewSummary,
  PreprocessingResult,
  ProcessingResult,
  ProcessingStatus,
  SummaryFormat,
  SummaryType,
} from "../../types/ingestion-pipeline";
import type { AIProvider } from "./preprocessing-service";
import {
  formatTranscriptForPrompt,
  SUMMARY_FORMATS,
  SUMMARY_TYPES,
  SUPADATA_PROCESSING_PROMPTS,
} from "./prompts";

/**
 * Processing cache data structure
 */
interface ProcessingCacheData {
  overview: OverviewSummary;
  enhancedSummaries: EnhancedSummary[];
}

/**
 * Options for processing
 */
export interface ProcessingOptions {
  /** Force re-processing even if cached */
  forceRefresh?: boolean;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** AI provider to use */
  provider?: string;
  /** AI model to use */
  modelId?: string;
}

/**
 * Processing Service
 *
 * Manages the processing stage with caching and parallel summary generation.
 */
export class ProcessingService {
  private aiProvider: AIProvider | null = null;
  private defaultProvider = "zhipu";
  private defaultModelId = "glm-4.7";

  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Set the AI provider
   */
  setAIProvider(provider: AIProvider): void {
    this.aiProvider = provider;
  }

  /**
   * Process content to generate summaries
   *
   * @param contentId - The content ID in the database
   * @param preprocessing - Preprocessing result
   * @param transcript - Raw transcript text
   * @param title - Content title
   * @param sourceType - The source type (youtube, article, etc.)
   * @param options - Processing options
   * @returns Processing result
   */
  async process(
    contentId: string,
    preprocessing: PreprocessingResult,
    transcript: string,
    title: string,
    sourceType: string,
    options: ProcessingOptions = {},
  ): Promise<ProcessingResult> {
    // Check cache if not forcing refresh
    if (!options.forceRefresh) {
      const cached = await this.getFromCache(contentId);
      if (cached && cached.status === "completed") {
        return this.createResultFromCache(contentId, cached);
      }
      if (cached && cached.status === "blocked") {
        return this.createBlockedResult(
          contentId,
          cached.errorMessage ?? "Content is blocked",
        );
      }
    }

    const provider = options.provider ?? this.defaultProvider;
    const modelId = options.modelId ?? this.defaultModelId;

    // Mark as processing
    await this.markAsProcessing(contentId, provider, modelId);

    try {
      // Run processing
      const result = await this.runProcessing(
        contentId,
        preprocessing,
        transcript,
        title,
        sourceType,
        provider,
        modelId,
      );

      // Store successful result
      await this.storeInCache(contentId, result, provider, modelId);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Processing failed";
      const shouldBlock = this.shouldBlockOnError(error);

      // Store failed result
      await this.storeFailedInCache(
        contentId,
        provider,
        modelId,
        errorMessage,
        shouldBlock,
      );

      return {
        contentId,
        success: false,
        blocked: shouldBlock,
        errorMessage,
        errorCode: shouldBlock ? "PROCESSING_BLOCKED" : "PROCESSING_FAILED",
        overview: this.createEmptyOverview(),
        enhancedSummaries: [],
        provider,
        modelId,
      };
    }
  }

  /**
   * Run the actual processing (9 parallel AI calls)
   */
  private async runProcessing(
    contentId: string,
    preprocessing: PreprocessingResult,
    transcript: string,
    title: string,
    sourceType: string,
    provider: string,
    modelId: string,
  ): Promise<ProcessingResult> {
    // Get prompts based on source type
    const prompts = this.getPromptsForSourceType(sourceType);

    // Format data for prompts
    const formattedTranscript = formatTranscriptForPrompt(
      transcript.split("\n").map((text, i) => ({
        text,
        offsetMs: i * 1000,
      })),
    );

    const entitiesStr = preprocessing.entities
      .slice(0, 10)
      .map((e) => e.name)
      .join(", ");

    const themesStr = preprocessing.themes
      .slice(0, 5)
      .map((t) => t.title)
      .join(", ");

    // Generate all summaries in parallel (9 calls)
    const [overview, ...enhancedResults] = await Promise.all([
      // 1. Overview summary
      this.generateOverview(
        prompts.overview,
        title,
        formattedTranscript,
        entitiesStr,
        themesStr,
      ),
      // 2-9. Enhanced summaries (4 types × 2 formats)
      ...this.generateEnhancedSummaryPromises(
        prompts,
        title,
        formattedTranscript,
        entitiesStr,
        themesStr,
      ),
    ]);

    return {
      contentId,
      success: true,
      blocked: false,
      overview,
      enhancedSummaries: enhancedResults,
      provider,
      modelId,
    };
  }

  /**
   * Generate overview summary
   */
  private async generateOverview(
    promptTemplate: string,
    title: string,
    transcript: string,
    entities: string,
    themes: string,
  ): Promise<OverviewSummary> {
    if (!this.aiProvider) {
      return this.createEmptyOverview();
    }

    const prompt = promptTemplate
      .replace("{title}", title)
      .replace("{transcript}", transcript)
      .replace("{entities}", entities)
      .replace("{themes}", themes);

    const result = await this.aiProvider.generateJson<OverviewSummary>(prompt);

    return {
      logline: result.logline ?? "",
      fullOverview: result.fullOverview ?? "",
      shortOverview: result.shortOverview ?? "",
      clickbaitRating: result.clickbaitRating ?? { score: 1, explanation: "" },
      mainThemes: result.mainThemes ?? [],
      contentCategory: result.contentCategory ?? "other",
    };
  }

  /**
   * Generate enhanced summary promises (8 calls)
   */
  private generateEnhancedSummaryPromises(
    prompts: typeof SUPADATA_PROCESSING_PROMPTS,
    title: string,
    transcript: string,
    entities: string,
    themes: string,
  ): Promise<EnhancedSummary>[] {
    const promises: Promise<EnhancedSummary>[] = [];

    for (const summaryType of SUMMARY_TYPES) {
      for (const format of SUMMARY_FORMATS) {
        promises.push(
          this.generateEnhancedSummary(
            prompts[summaryType][format],
            summaryType,
            format,
            title,
            transcript,
            entities,
            themes,
          ),
        );
      }
    }

    return promises;
  }

  /**
   * Generate a single enhanced summary
   */
  private async generateEnhancedSummary(
    promptTemplate: string,
    summaryType: SummaryType,
    format: SummaryFormat,
    title: string,
    transcript: string,
    entities: string,
    themes: string,
  ): Promise<EnhancedSummary> {
    if (!this.aiProvider) {
      return {
        summaryType,
        format,
        short: "",
        detailed: "",
      };
    }

    const prompt = promptTemplate
      .replace("{title}", title)
      .replace("{transcript}", transcript)
      .replace("{entities}", entities)
      .replace("{themes}", themes);

    const result = await this.aiProvider.generateJson<{
      short: string;
      detailed: string | string[];
    }>(prompt);

    // Normalize detailed to string
    let detailed = "";
    if (Array.isArray(result.detailed)) {
      detailed = result.detailed.join("\n\n");
    } else {
      detailed = result.detailed ?? "";
    }

    return {
      summaryType,
      format,
      short: result.short ?? "",
      detailed,
    };
  }

  /**
   * Get prompts for source type
   */
  private getPromptsForSourceType(
    sourceType: string,
  ): typeof SUPADATA_PROCESSING_PROMPTS {
    // Currently only Supadata prompts are implemented
    return SUPADATA_PROCESSING_PROMPTS;
  }

  /**
   * Create empty overview for fallback
   */
  private createEmptyOverview(): OverviewSummary {
    return {
      logline: "",
      fullOverview: "",
      shortOverview: "",
      clickbaitRating: { score: 1, explanation: "" },
      mainThemes: [],
      contentCategory: "other",
    };
  }

  /**
   * Mark content as processing
   */
  private async markAsProcessing(
    contentId: string,
    provider: string,
    modelId: string,
  ): Promise<void> {
    await this.db
      .insert(processingCache)
      .values({
        contentId,
        contentJson: {
          overview: this.createEmptyOverview(),
          enhancedSummaries: [],
        },
        status: "processing",
        processingStartedAt: new Date(),
        provider,
        modelId,
      })
      .onConflictDoUpdate({
        target: processingCache.contentId,
        set: {
          status: "processing",
          processingStartedAt: new Date(),
          provider,
          modelId,
        },
      });
  }

  /**
   * Get processing result from cache
   */
  async getFromCache(contentId: string): Promise<{
    status: ProcessingStatus;
    data?: ProcessingCacheData;
    provider: string;
    modelId: string;
    errorMessage?: string;
  } | null> {
    const [cached] = await this.db
      .select()
      .from(processingCache)
      .where(eq(processingCache.contentId, contentId))
      .limit(1);

    if (!cached) {
      return null;
    }

    return {
      status: cached.status as ProcessingStatus,
      data: cached.contentJson as ProcessingCacheData,
      provider: cached.provider,
      modelId: cached.modelId,
      errorMessage: cached.errorMessage ?? undefined,
    };
  }

  /**
   * Store processing result in cache
   */
  private async storeInCache(
    contentId: string,
    result: ProcessingResult,
    provider: string,
    modelId: string,
  ): Promise<void> {
    const cacheData: ProcessingCacheData = {
      overview: result.overview,
      enhancedSummaries: result.enhancedSummaries,
    };

    const status: ProcessingStatus = result.blocked
      ? "blocked"
      : result.success
        ? "completed"
        : "failed";

    await this.db
      .update(processingCache)
      .set({
        contentJson: cacheData,
        status,
        provider,
        modelId,
        errorMessage: result.errorMessage,
        errorCode: result.errorCode,
      })
      .where(eq(processingCache.contentId, contentId));
  }

  /**
   * Store failed processing in cache
   */
  private async storeFailedInCache(
    contentId: string,
    provider: string,
    modelId: string,
    errorMessage: string,
    blocked: boolean,
  ): Promise<void> {
    const status: ProcessingStatus = blocked ? "blocked" : "failed";

    await this.db
      .update(processingCache)
      .set({
        status,
        provider,
        modelId,
        errorMessage,
        errorCode: blocked ? "PROCESSING_BLOCKED" : "PROCESSING_FAILED",
      })
      .where(eq(processingCache.contentId, contentId));
  }

  /**
   * Create result from cached data
   */
  private createResultFromCache(
    contentId: string,
    cached: {
      data?: ProcessingCacheData;
      provider: string;
      modelId: string;
    },
  ): ProcessingResult {
    const data = cached.data!;

    return {
      contentId,
      success: true,
      blocked: false,
      overview: data.overview,
      enhancedSummaries: data.enhancedSummaries,
      provider: cached.provider,
      modelId: cached.modelId,
    };
  }

  /**
   * Create a blocked result
   */
  private createBlockedResult(
    contentId: string,
    errorMessage: string,
  ): ProcessingResult {
    return {
      contentId,
      success: false,
      blocked: true,
      errorMessage,
      errorCode: "PROCESSING_BLOCKED",
      overview: this.createEmptyOverview(),
      enhancedSummaries: [],
      provider: this.defaultProvider,
      modelId: this.defaultModelId,
    };
  }

  /**
   * Determine if an error should block the content
   */
  private shouldBlockOnError(error: unknown): boolean {
    if (error instanceof Error) {
      const blockingPatterns = [/policy.*violation/i, /content.*blocked/i];
      return blockingPatterns.some((pattern) => pattern.test(error.message));
    }
    return false;
  }
}

/**
 * Create a processing service instance
 */
export function createProcessingService(
  db: PostgresJsDatabase<typeof schema>,
): ProcessingService {
  return new ProcessingService(db);
}
