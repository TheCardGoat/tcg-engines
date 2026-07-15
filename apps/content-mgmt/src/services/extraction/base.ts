/**
 * Base Extraction Service Adapter
 *
 * Abstract base class for extraction service adapters.
 * Provides common functionality and enforces the adapter interface.
 */

import type {
  ContentMetadata,
  ExtractionConfig,
  ExtractionServiceAdapter,
  FetchContentOptions,
  ParsedUrl,
  RawContent,
  SourceType,
  ValidationError,
  ValidationResult,
  ValidationRule,
} from "../../types/extraction-service";

/**
 * Abstract base class for extraction service adapters
 *
 * Provides common validation logic and helper methods.
 * Subclasses must implement the abstract methods for source-specific behavior.
 */
export abstract class BaseExtractionAdapter implements ExtractionServiceAdapter {
  abstract readonly serviceId: string;
  abstract readonly supportedSourceTypes: readonly SourceType[];

  /**
   * Parse a URL to identify the content source
   * Must be implemented by subclasses
   */
  abstract parseUrl(url: string): ParsedUrl | null;

  /**
   * Fetch raw content from the source
   * Must be implemented by subclasses
   */
  abstract fetchContent(contentId: string, options?: FetchContentOptions): Promise<RawContent>;

  /**
   * Extract metadata from raw content
   * Must be implemented by subclasses
   */
  abstract extractMetadata(rawContent: RawContent): Promise<ContentMetadata>;

  /**
   * Get the configuration for this extraction service
   * Must be implemented by subclasses
   */
  abstract getConfig(): ExtractionConfig;

  /**
   * Check if this adapter can handle the given URL
   *
   * Default implementation uses parseUrl to determine if URL is supported.
   * Subclasses can override for more efficient URL checking.
   */
  canHandle(url: string): boolean {
    return this.parseUrl(url) !== null;
  }

  /**
   * Validate content against service-specific rules
   *
   * Default implementation runs all validation rules from config.
   * Subclasses can override to add custom validation logic.
   */
  async validateContent(metadata: ContentMetadata): Promise<ValidationResult> {
    const config = this.getConfig();
    const errors: ValidationError[] = [];
    let shouldBlock = false;

    // Run all validation rules
    for (const rule of config.validationRules) {
      const error = rule.validate(metadata);
      if (error) {
        errors.push(error);
        if (rule.blocksOnFailure) {
          shouldBlock = true;
        }
      }
    }

    // Check duration constraint (for video content)
    if (config.maxDurationSeconds !== undefined && metadata.durationSeconds !== undefined) {
      if (metadata.durationSeconds > config.maxDurationSeconds) {
        errors.push({
          code: "CONTENT_TOO_LONG",
          field: "durationSeconds",
          message: `Content duration (${metadata.durationSeconds}s) exceeds maximum allowed (${config.maxDurationSeconds}s)`,
        });
        shouldBlock = true;
      }
    }

    // Check content length constraint (for text content)
    if (config.maxContentLength !== undefined && metadata.contentLength !== undefined) {
      if (metadata.contentLength > config.maxContentLength) {
        errors.push({
          code: "CONTENT_TOO_LONG",
          field: "contentLength",
          message: `Content length (${metadata.contentLength} chars) exceeds maximum allowed (${config.maxContentLength} chars)`,
        });
        shouldBlock = true;
      }
    }

    // Check language constraint
    if (config.supportedLanguages.length > 0 && metadata.language !== undefined) {
      if (!config.supportedLanguages.includes(metadata.language)) {
        errors.push({
          code: "UNSUPPORTED_LANGUAGE",
          field: "language",
          message: `Language '${metadata.language}' is not supported. Supported languages: ${config.supportedLanguages.join(", ")}`,
        });
        shouldBlock = true;
      }
    }

    return {
      errors,
      isValid: errors.length === 0,
      shouldBlock,
    };
  }

  /**
   * Helper method to create a validation rule
   */
  protected createValidationRule(
    id: string,
    description: string,
    blocksOnFailure: boolean,
    validate: (metadata: ContentMetadata) => ValidationError | null,
  ): ValidationRule {
    return { blocksOnFailure, description, id, validate };
  }

  /**
   * Helper method to normalize a URL by removing unnecessary query parameters
   */
  protected normalizeUrl(url: string, keepParams: string[] = []): string {
    try {
      const parsed = new URL(url);

      // Keep only specified query parameters
      if (keepParams.length > 0) {
        const newParams = new URLSearchParams();
        for (const param of keepParams) {
          const value = parsed.searchParams.get(param);
          if (value !== null) {
            newParams.set(param, value);
          }
        }
        parsed.search = newParams.toString();
      } else {
        parsed.search = "";
      }

      // Remove hash
      parsed.hash = "";

      return parsed.toString();
    } catch {
      return url;
    }
  }

  /**
   * Helper method to extract domain from URL
   */
  protected getDomain(url: string): string | null {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return null;
    }
  }
}
