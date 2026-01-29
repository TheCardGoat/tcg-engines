/**
 * Preprocessing Service
 *
 * Handles the preprocessing stage of the content ingestion pipeline.
 * Runs AI analysis to extract entities, themes, and segments.
 */

import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../../db/schema";
import { preprocessingCache } from "../../db/schema";
import type { RawContent } from "../../types/extraction-service";
import type {
  AnalyzedSegment,
  ExtractedEntity,
  ExtractedTheme,
  PreprocessingResult,
  PreprocessingStatus,
} from "../../types/ingestion-pipeline";
import {
  formatTranscriptForPrompt,
  getTranscriptExcerpt,
  SUPADATA_PREPROCESSING_PROMPTS,
} from "./prompts";

/**
 * Preprocessing cache data structure
 */
interface PreprocessingCacheData {
  entities: ExtractedEntity[];
  themes: ExtractedTheme[];
  segments: AnalyzedSegment[];
  isGameRelated: boolean;
}

/**
 * AI Provider interface for preprocessing
 */
export interface AIProvider {
  generateJson<T>(prompt: string, schema?: unknown): Promise<T>;
}

/**
 * Options for preprocessing
 */
export interface PreprocessingOptions {
  /** Force re-preprocessing even if cached */
  forceRefresh?: boolean;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** AI provider to use */
  provider?: string;
  /** AI model to use */
  modelId?: string;
}

/**
 * Preprocessing Service
 *
 * Manages the preprocessing stage with caching and blocking support.
 */
export class PreprocessingService {
  private aiProvider: AIProvider | null = null;
  private defaultProvider = "zhipu";
  private defaultModelId = "glm-4.5-air";

  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Set the AI provider
   */
  setAIProvider(provider: AIProvider): void {
    this.aiProvider = provider;
  }

  /**
   * Preprocess content
   *
   * @param contentId - The content ID in the database
   * @param rawContent - Raw content from extraction
   * @param sourceType - The source type (youtube, article, etc.)
   * @param options - Preprocessing options
   * @returns Preprocessing result
   */
  async preprocess(
    contentId: string,
    rawContent: RawContent,
    sourceType: string,
    options: PreprocessingOptions = {},
  ): Promise<PreprocessingResult> {
    // Check cache if not forcing refresh
    if (!options.forceRefresh) {
      const cached = await this.getFromCache(contentId);
      if (cached && cached.status === "complete") {
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

    try {
      // Run preprocessing based on source type
      const result = await this.runPreprocessing(
        contentId,
        rawContent,
        sourceType,
        provider,
        modelId,
      );

      // Check if content should be blocked (not game-related)
      if (!result.isGameRelated) {
        const blockedResult: PreprocessingResult = {
          ...result,
          blocked: true,
          errorMessage: "Content is not game-related",
          errorCode: "NON_GAME_CONTENT",
        };

        await this.storeInCache(contentId, blockedResult, provider, modelId);
        return blockedResult;
      }

      // Store successful result
      await this.storeInCache(contentId, result, provider, modelId);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Preprocessing failed";
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
        errorCode: shouldBlock
          ? "PREPROCESSING_BLOCKED"
          : "PREPROCESSING_FAILED",
        entities: [],
        themes: [],
        segments: [],
        isGameRelated: false,
        provider,
        modelId,
      };
    }
  }

  /**
   * Run the actual preprocessing
   */
  private async runPreprocessing(
    contentId: string,
    rawContent: RawContent,
    sourceType: string,
    provider: string,
    modelId: string,
  ): Promise<PreprocessingResult> {
    // Get prompts based on source type
    const prompts = this.getPromptsForSourceType(sourceType);

    // Format transcript for prompts
    const formattedTranscript = rawContent.segments
      ? formatTranscriptForPrompt(rawContent.segments)
      : rawContent.textContent;

    const transcriptExcerpt = getTranscriptExcerpt(rawContent.textContent);

    // Run 3 parallel AI calls
    const [entitiesResult, themesResult, segmentsResult] = await Promise.all([
      this.extractEntities(formattedTranscript, prompts.entityExtraction),
      this.analyzeThemes(formattedTranscript, prompts.themeAnalysis),
      this.segmentContent(formattedTranscript, prompts.contentSegmentation),
    ]);

    // Validate game relevance
    const relevanceResult = await this.validateGameRelevance(
      transcriptExcerpt,
      prompts.gameRelevance,
    );

    return {
      contentId,
      success: true,
      blocked: false,
      entities: entitiesResult,
      themes: themesResult,
      segments: segmentsResult,
      isGameRelated: relevanceResult.isGameRelated,
      provider,
      modelId,
    };
  }

  /**
   * Extract entities from content
   */
  private async extractEntities(
    transcript: string,
    promptTemplate: string,
  ): Promise<ExtractedEntity[]> {
    if (!this.aiProvider) {
      // Return empty if no AI provider (for testing)
      return [];
    }

    const prompt = promptTemplate.replace("{transcript}", transcript);
    const result = await this.aiProvider.generateJson<{
      entities: ExtractedEntity[];
    }>(prompt);

    return result.entities ?? [];
  }

  /**
   * Analyze themes in content
   */
  private async analyzeThemes(
    transcript: string,
    promptTemplate: string,
  ): Promise<ExtractedTheme[]> {
    if (!this.aiProvider) {
      return [];
    }

    const prompt = promptTemplate.replace("{transcript}", transcript);
    const result = await this.aiProvider.generateJson<{
      themes: ExtractedTheme[];
    }>(prompt);

    return result.themes ?? [];
  }

  /**
   * Segment content into logical sections
   */
  private async segmentContent(
    transcript: string,
    promptTemplate: string,
  ): Promise<AnalyzedSegment[]> {
    if (!this.aiProvider) {
      return [];
    }

    const prompt = promptTemplate.replace("{transcript}", transcript);
    const result = await this.aiProvider.generateJson<{
      segments: AnalyzedSegment[];
    }>(prompt);

    return result.segments ?? [];
  }

  /**
   * Validate if content is game-related
   */
  private async validateGameRelevance(
    transcriptExcerpt: string,
    promptTemplate: string,
  ): Promise<{ isGameRelated: boolean; confidence: number }> {
    if (!this.aiProvider) {
      // Default to game-related if no AI provider
      return { isGameRelated: true, confidence: 1.0 };
    }

    const prompt = promptTemplate
      .replace("{title}", "")
      .replace("{description}", "")
      .replace("{transcript_excerpt}", transcriptExcerpt);

    const result = await this.aiProvider.generateJson<{
      isGameRelated: boolean;
      confidence: number;
    }>(prompt);

    return {
      isGameRelated: result.isGameRelated ?? false,
      confidence: result.confidence ?? 0,
    };
  }

  /**
   * Get prompts for source type
   */
  private getPromptsForSourceType(sourceType: string): {
    entityExtraction: string;
    themeAnalysis: string;
    contentSegmentation: string;
    gameRelevance: string;
  } {
    // Currently only Supadata prompts are implemented
    // Future: Add Tabstack prompts for articles
    return SUPADATA_PREPROCESSING_PROMPTS;
  }

  /**
   * Get preprocessing result from cache
   */
  async getFromCache(contentId: string): Promise<{
    status: PreprocessingStatus;
    data?: PreprocessingCacheData;
    provider: string;
    modelId: string;
    errorMessage?: string;
  } | null> {
    const [cached] = await this.db
      .select()
      .from(preprocessingCache)
      .where(eq(preprocessingCache.contentId, contentId))
      .limit(1);

    if (!cached) {
      return null;
    }

    return {
      status: cached.status as PreprocessingStatus,
      data: cached.contentJson as PreprocessingCacheData,
      provider: cached.provider,
      modelId: cached.modelId,
      errorMessage: cached.errorMessage ?? undefined,
    };
  }

  /**
   * Store preprocessing result in cache
   */
  private async storeInCache(
    contentId: string,
    result: PreprocessingResult,
    provider: string,
    modelId: string,
  ): Promise<void> {
    const cacheData: PreprocessingCacheData = {
      entities: result.entities,
      themes: result.themes,
      segments: result.segments,
      isGameRelated: result.isGameRelated,
    };

    const status: PreprocessingStatus = result.blocked
      ? "blocked"
      : result.success
        ? "complete"
        : "failed";

    await this.db
      .insert(preprocessingCache)
      .values({
        contentId,
        contentJson: cacheData,
        status,
        provider,
        modelId,
        errorMessage: result.errorMessage,
      })
      .onConflictDoUpdate({
        target: preprocessingCache.contentId,
        set: {
          contentJson: cacheData,
          status,
          provider,
          modelId,
          errorMessage: result.errorMessage,
          createdAt: new Date(),
        },
      });
  }

  /**
   * Store failed preprocessing in cache
   */
  private async storeFailedInCache(
    contentId: string,
    provider: string,
    modelId: string,
    errorMessage: string,
    blocked: boolean,
  ): Promise<void> {
    const status: PreprocessingStatus = blocked ? "blocked" : "failed";

    await this.db
      .insert(preprocessingCache)
      .values({
        contentId,
        contentJson: {
          entities: [],
          themes: [],
          segments: [],
          isGameRelated: false,
        },
        status,
        provider,
        modelId,
        errorMessage,
      })
      .onConflictDoUpdate({
        target: preprocessingCache.contentId,
        set: {
          status,
          provider,
          modelId,
          errorMessage,
          createdAt: new Date(),
        },
      });
  }

  /**
   * Create result from cached data
   */
  private createResultFromCache(
    contentId: string,
    cached: {
      data?: PreprocessingCacheData;
      provider: string;
      modelId: string;
    },
  ): PreprocessingResult {
    const data = cached.data!;

    return {
      contentId,
      success: true,
      blocked: false,
      entities: data.entities,
      themes: data.themes,
      segments: data.segments,
      isGameRelated: data.isGameRelated,
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
  ): PreprocessingResult {
    return {
      contentId,
      success: false,
      blocked: true,
      errorMessage,
      errorCode: "PREPROCESSING_BLOCKED",
      entities: [],
      themes: [],
      segments: [],
      isGameRelated: false,
      provider: this.defaultProvider,
      modelId: this.defaultModelId,
    };
  }

  /**
   * Determine if an error should block the content
   */
  private shouldBlockOnError(error: unknown): boolean {
    if (error instanceof Error) {
      const blockingPatterns = [/non.*game.*content/i, /policy.*violation/i];
      return blockingPatterns.some((pattern) => pattern.test(error.message));
    }
    return false;
  }
}

/**
 * Create a preprocessing service instance
 */
export function createPreprocessingService(
  db: PostgresJsDatabase<typeof schema>,
): PreprocessingService {
  return new PreprocessingService(db);
}
