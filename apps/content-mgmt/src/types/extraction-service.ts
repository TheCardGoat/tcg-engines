/**
 * Extraction Service Types
 *
 * Defines interfaces for content extraction services (Supadata, Tabstack, etc.)
 * Each extraction service implements these interfaces to provide a unified
 * content ingestion pipeline.
 */

/**
 * Source types supported by the content ingestion pipeline
 */
export type SourceType = "youtube" | "article" | "rss" | "http";

/**
 * Result of parsing a URL to identify the content source
 */
export interface ParsedUrl {
  /** The type of source (youtube, article, etc.) */
  sourceType: SourceType;
  /** Source-specific content identifier (e.g., YouTube video ID) */
  contentId: string;
  /** Normalized URL with stripped query params for consistent caching */
  normalizedUrl: string;
}

/**
 * Raw content fetched from an extraction service
 * This is the unprocessed content before any AI analysis
 */
export interface RawContent {
  /** Source-specific content identifier */
  contentId: string;
  /** The type of source */
  sourceType: SourceType;
  /** Main text content (transcript, article body, etc.) */
  textContent: string;
  /** Structured segments with timestamps (for video content) */
  segments?: ContentSegment[];
  /** Raw metadata from the extraction service */
  rawMetadata: Record<string, unknown>;
  /** Language of the content */
  language?: string;
  /** Available languages (for multi-language content) */
  availableLanguages?: string[];
}

/**
 * Content segment with timing information (for video transcripts)
 */
export interface ContentSegment {
  /** Segment text */
  text: string;
  /** Start offset in milliseconds */
  offsetMs: number;
  /** Duration in milliseconds */
  durationMs: number;
  /** Language of this segment */
  language?: string;
}

/**
 * Metadata extracted from content
 * This is normalized across all extraction services
 */
export interface ContentMetadata {
  /** Content title */
  title: string;
  /** Content description or summary */
  description?: string;
  /** Author/creator name */
  authorName?: string;
  /** Channel/publication name */
  channelName?: string;
  /** Channel/publication ID */
  channelId?: string;
  /** URL to the channel/publication */
  channelUrl?: string;
  /** Duration in seconds (for video/audio content) */
  durationSeconds?: number;
  /** Content length in characters (for text content) */
  contentLength?: number;
  /** Publication date */
  publishedAt?: Date;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** View/read count */
  viewCount?: number;
  /** Like count */
  likeCount?: number;
  /** Comment count */
  commentCount?: number;
  /** Detected language */
  language?: string;
  /** Source-specific metadata (preserved for storage) */
  sourceMetadata: Record<string, unknown>;
}

/**
 * Result of content validation
 */
export interface ValidationResult {
  /** Whether the content is valid */
  isValid: boolean;
  /** Whether the content should be blocked (permanent rejection) */
  shouldBlock: boolean;
  /** Validation errors if not valid */
  errors: ValidationError[];
}

/**
 * Individual validation error
 */
export interface ValidationError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Field that failed validation (if applicable) */
  field?: string;
}

/**
 * Configuration for an extraction service
 */
export interface ExtractionConfig {
  /** Maximum duration in seconds (for video content) */
  maxDurationSeconds?: number;
  /** Maximum content length in characters (for text content) */
  maxContentLength?: number;
  /** Supported languages */
  supportedLanguages: string[];
  /** Extraction timeout in milliseconds */
  extractionTimeoutMs: number;
  /** Validation rules to apply */
  validationRules: ValidationRule[];
}

/**
 * Validation rule definition
 */
export interface ValidationRule {
  /** Rule identifier */
  id: string;
  /** Rule description */
  description: string;
  /** Whether failing this rule should block the content */
  blocksOnFailure: boolean;
  /** Validation function (implemented by each rule) */
  validate: (metadata: ContentMetadata) => ValidationError | null;
}

/**
 * Extraction Service Adapter Interface
 *
 * Each extraction service (Supadata, Tabstack, etc.) implements this interface
 * to provide content extraction capabilities to the ingestion pipeline.
 */
export interface ExtractionServiceAdapter {
  /** Unique identifier for this extraction service */
  readonly serviceId: string;

  /** Source types this adapter can handle */
  readonly supportedSourceTypes: readonly SourceType[];

  /**
   * Parse a URL to identify the content source and extract the content ID
   * @param url - The URL to parse
   * @returns Parsed URL information or null if URL is not supported
   */
  parseUrl(url: string): ParsedUrl | null;

  /**
   * Check if this adapter can handle the given URL
   * @param url - The URL to check
   */
  canHandle(url: string): boolean;

  /**
   * Fetch raw content from the source
   * @param contentId - Source-specific content identifier
   * @param options - Optional fetch options
   */
  fetchContent(
    contentId: string,
    options?: FetchContentOptions,
  ): Promise<RawContent>;

  /**
   * Extract normalized metadata from raw content
   * @param rawContent - Raw content from fetchContent
   */
  extractMetadata(rawContent: RawContent): Promise<ContentMetadata>;

  /**
   * Validate content against service-specific rules
   * @param metadata - Content metadata to validate
   */
  validateContent(metadata: ContentMetadata): Promise<ValidationResult>;

  /**
   * Get the configuration for this extraction service
   */
  getConfig(): ExtractionConfig;
}

/**
 * Options for fetching content
 */
export interface FetchContentOptions {
  /** Preferred language for content */
  preferredLanguage?: string;
  /** Whether to include raw transcript/text */
  includeRawText?: boolean;
  /** Timeout override in milliseconds */
  timeoutMs?: number;
}

/**
 * Result of the extraction stage
 */
export interface ExtractionResult {
  /** Content ID in the database */
  contentId: string;
  /** Raw content from extraction service */
  rawContent: RawContent;
  /** Extracted metadata */
  metadata: ContentMetadata;
  /** Validation result */
  validation: ValidationResult;
  /** Extraction service used */
  provider: string;
  /** Whether extraction was successful */
  success: boolean;
  /** Error message if extraction failed */
  errorMessage?: string;
}
