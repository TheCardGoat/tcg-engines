/**
 * Content Ingestion Service
 *
 * Orchestrates the content ingestion pipeline:
 * extraction → preprocessing → processing → postprocessing
 *
 * Each stage can flag content as blocked, preventing future reprocessing.
 */

import type {
  ContentStatus,
  ExtractionResult,
  ExtractionServiceAdapter,
  PipelineOptions,
  PipelineResult,
  PipelineStage,
  PostprocessingResult,
  PreprocessingResult,
  ProcessingResult,
} from "../../types";
import { BLOCKING_ERROR_CODES } from "../../types";
import { extractionServiceRegistry } from "../extraction/registry";

/**
 * Pipeline stage handlers interface
 */
export interface PipelineStageHandlers {
  /** Handle extraction stage */
  onExtraction?: (result: ExtractionResult) => Promise<void>;
  /** Handle preprocessing stage */
  onPreprocessing?: (result: PreprocessingResult) => Promise<void>;
  /** Handle processing stage */
  onProcessing?: (result: ProcessingResult) => Promise<void>;
  /** Handle postprocessing stage */
  onPostprocessing?: (result: PostprocessingResult) => Promise<void>;
  /** Handle blocking */
  onBlocked?: (stage: PipelineStage, reason: string) => Promise<void>;
  /** Handle errors */
  onError?: (stage: PipelineStage, error: Error) => Promise<void>;
}

/**
 * Content Ingestion Service
 *
 * Orchestrates the full content ingestion pipeline with blocking support.
 */
export class ContentIngestionService {
  private handlers: PipelineStageHandlers;

  constructor(handlers: PipelineStageHandlers = {}) {
    this.handlers = handlers;
  }

  /**
   * Ingest content from a URL
   *
   * @param url - The URL to ingest
   * @param userId - The user ID submitting the content
   * @param options - Pipeline options
   * @returns Pipeline result with all stage results
   */
  async ingestContent(
    url: string,
    userId: string,
    options: PipelineOptions = {},
  ): Promise<PipelineResult> {
    // Find adapter for URL
    const adapter = extractionServiceRegistry.getAdapterForUrl(url);
    if (!adapter) {
      return this.createBlockedResult(
        "",
        "youtube", // Default, will be overridden
        "extraction",
        `No extraction service available for URL: ${url}`,
      );
    }

    // Parse URL to get content ID and source type
    const parsed = adapter.parseUrl(url);
    if (!parsed) {
      return this.createBlockedResult(
        "",
        "youtube",
        "extraction",
        `Invalid URL format: ${url}`,
      );
    }

    const { sourceType, contentId, normalizedUrl } = parsed;

    // Initialize result
    const result: PipelineResult = {
      contentId,
      sourceType,
      success: false,
      blocked: false,
    };

    try {
      // Stage 1: Extraction
      if (!options.skipStages?.includes("extraction")) {
        const extractionResult = await this.runExtractionStage(
          adapter,
          contentId,
          normalizedUrl,
          options,
        );

        result.extraction = extractionResult;

        if (!extractionResult.success) {
          if (extractionResult.validation?.shouldBlock) {
            return this.markBlocked(
              result,
              "extraction",
              extractionResult.errorMessage ?? "Extraction validation failed",
            );
          }
          // Non-blocking failure - can be retried
          return result;
        }

        await this.handlers.onExtraction?.(extractionResult);
      }

      // Stage 2: Preprocessing
      if (!options.skipStages?.includes("preprocessing")) {
        const preprocessingResult = await this.runPreprocessingStage(
          contentId,
          sourceType,
          result.extraction!,
          options,
        );

        result.preprocessing = preprocessingResult;

        if (preprocessingResult.blocked) {
          return this.markBlocked(
            result,
            "preprocessing",
            preprocessingResult.errorMessage ?? "Preprocessing blocked",
          );
        }

        if (!preprocessingResult.success) {
          return result;
        }

        await this.handlers.onPreprocessing?.(preprocessingResult);
      }

      // Stage 3: Processing
      if (!options.skipStages?.includes("processing")) {
        const processingResult = await this.runProcessingStage(
          contentId,
          sourceType,
          result.preprocessing!,
          options,
        );

        result.processing = processingResult;

        if (processingResult.blocked) {
          return this.markBlocked(
            result,
            "processing",
            processingResult.errorMessage ?? "Processing blocked",
          );
        }

        if (!processingResult.success) {
          return result;
        }

        await this.handlers.onProcessing?.(processingResult);
      }

      // Stage 4: Postprocessing
      if (!options.skipStages?.includes("postprocessing")) {
        const postprocessingResult = await this.runPostprocessingStage(
          contentId,
          result.processing!,
          options,
        );

        result.postprocessing = postprocessingResult;

        if (!postprocessingResult.success) {
          return result;
        }

        await this.handlers.onPostprocessing?.(postprocessingResult);
      }

      // All stages completed successfully
      result.success = true;
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorCode = this.getErrorCode(error);

      // Check if this error should block the content
      if (this.shouldBlockOnError(errorCode)) {
        return this.markBlocked(result, "extraction", errorMessage);
      }

      // Non-blocking error
      result.success = false;
      return result;
    }
  }

  /**
   * Run the extraction stage
   */
  private async runExtractionStage(
    adapter: ExtractionServiceAdapter,
    contentId: string,
    normalizedUrl: string,
    options: PipelineOptions,
  ): Promise<ExtractionResult> {
    try {
      // Fetch raw content
      const rawContent = await adapter.fetchContent(contentId, {
        timeoutMs: options.timeouts?.extraction,
      });

      // Extract metadata
      const metadata = await adapter.extractMetadata(rawContent);

      // Validate content
      const validation = await adapter.validateContent(metadata);

      return {
        contentId,
        rawContent,
        metadata,
        validation,
        provider: adapter.serviceId,
        success: validation.isValid,
        errorMessage: validation.isValid
          ? undefined
          : validation.errors.map((e) => e.message).join("; "),
      };
    } catch (error) {
      return {
        contentId,
        rawContent: {
          contentId,
          sourceType: "youtube",
          textContent: "",
          rawMetadata: {},
        },
        metadata: {
          title: "",
          sourceMetadata: {},
        },
        validation: {
          isValid: false,
          shouldBlock: this.shouldBlockOnError(this.getErrorCode(error)),
          errors: [
            {
              code: this.getErrorCode(error),
              message:
                error instanceof Error ? error.message : "Extraction failed",
            },
          ],
        },
        provider: adapter.serviceId,
        success: false,
        errorMessage:
          error instanceof Error ? error.message : "Extraction failed",
      };
    }
  }

  /**
   * Run the preprocessing stage
   *
   * This is a placeholder - actual implementation will be in preprocessing-service.ts
   */
  private async runPreprocessingStage(
    contentId: string,
    sourceType: string,
    extraction: ExtractionResult,
    options: PipelineOptions,
  ): Promise<PreprocessingResult> {
    // Placeholder - will be implemented in preprocessing service
    return {
      contentId,
      success: true,
      blocked: false,
      entities: [],
      themes: [],
      segments: [],
      isGameRelated: true,
      provider: "placeholder",
      modelId: "placeholder",
    };
  }

  /**
   * Run the processing stage
   *
   * This is a placeholder - actual implementation will be in processing-service.ts
   */
  private async runProcessingStage(
    contentId: string,
    sourceType: string,
    preprocessing: PreprocessingResult,
    options: PipelineOptions,
  ): Promise<ProcessingResult> {
    // Placeholder - will be implemented in processing service
    return {
      contentId,
      success: true,
      blocked: false,
      overview: {
        logline: "",
        fullOverview: "",
        shortOverview: "",
        clickbaitRating: { score: 1, explanation: "" },
        mainThemes: [],
        contentCategory: "other",
      },
      enhancedSummaries: [],
      provider: "placeholder",
      modelId: "placeholder",
    };
  }

  /**
   * Run the postprocessing stage
   *
   * This is a placeholder - actual implementation will be in postprocessing-service.ts
   */
  private async runPostprocessingStage(
    contentId: string,
    processing: ProcessingResult,
    options: PipelineOptions,
  ): Promise<PostprocessingResult> {
    // Placeholder - will be implemented in postprocessing service
    return {
      contentId,
      success: true,
      blocked: false,
      tags: [],
      hotnessScore: 0,
      baitRating: 1,
    };
  }

  /**
   * Mark the result as blocked
   */
  private markBlocked(
    result: PipelineResult,
    stage: PipelineStage,
    reason: string,
  ): PipelineResult {
    result.blocked = true;
    result.blockedAtStage = stage;
    result.blockReason = reason;
    result.success = false;

    // Call blocked handler
    this.handlers.onBlocked?.(stage, reason);

    return result;
  }

  /**
   * Create a blocked result for early failures
   */
  private createBlockedResult(
    contentId: string,
    sourceType: "youtube" | "article" | "rss" | "http",
    stage: PipelineStage,
    reason: string,
  ): PipelineResult {
    return {
      contentId,
      sourceType,
      success: false,
      blocked: true,
      blockedAtStage: stage,
      blockReason: reason,
    };
  }

  /**
   * Get error code from an error
   */
  private getErrorCode(error: unknown): string {
    if (error instanceof Error) {
      // Check for custom error code property
      if ("code" in error && typeof error.code === "string") {
        return error.code;
      }
      // Use error name as fallback
      return error.name;
    }
    return "UNKNOWN_ERROR";
  }

  /**
   * Check if an error should block the content
   */
  private shouldBlockOnError(errorCode: string): boolean {
    return BLOCKING_ERROR_CODES.includes(
      errorCode as (typeof BLOCKING_ERROR_CODES)[number],
    );
  }

  /**
   * Check if content is blocked
   *
   * This should check the database for blocked status.
   * Placeholder implementation - will be connected to database.
   */
  async isBlocked(contentId: string): Promise<boolean> {
    // Placeholder - will check database
    return false;
  }

  /**
   * Get the current status of content
   *
   * Placeholder implementation - will be connected to database.
   */
  async getContentStatus(contentId: string): Promise<ContentStatus | null> {
    // Placeholder - will check database
    return null;
  }
}

/**
 * Create a content ingestion service with the given handlers
 */
export function createContentIngestionService(
  handlers: PipelineStageHandlers = {},
): ContentIngestionService {
  return new ContentIngestionService(handlers);
}
