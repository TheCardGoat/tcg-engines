/**
 * Supadata Extraction Adapter
 *
 * Extraction service adapter for YouTube videos using the Supadata API.
 * Handles transcript extraction, metadata fetching, and validation.
 */

import type {
  ContentMetadata,
  ContentSegment,
  ExtractionConfig,
  FetchContentOptions,
  ParsedUrl,
  RawContent,
  ValidationRule,
} from "../../types/extraction-service";
import { BaseExtractionAdapter } from "./base";

/**
 * YouTube URL patterns for video ID extraction
 */
const YOUTUBE_PATTERNS = [
  // Standard youtube.com/watch?v=
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&|$)/,
  // Short youtu.be/
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?|$|\/)/,
  // Mobile m.youtube.com/watch?v=
  /(?:https?:\/\/)?m\.youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&|$)/,
  // YouTube Shorts
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?|$|\/)/,
  // Embed URLs
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?|$|\/)/,
  // YouTube live URLs
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:\?|$|\/)/,
];

/**
 * Default configuration for Supadata extraction
 */
const DEFAULT_CONFIG: ExtractionConfig = {
  maxDurationSeconds: 1800, // 30 minutes
  supportedLanguages: ["en"],
  extractionTimeoutMs: 60000, // 1 minute
  validationRules: [],
};

/**
 * Supadata transcript response structure
 */
interface SupadataTranscriptResponse {
  content: Array<{
    text: string;
    offset: number; // milliseconds
    duration: number; // milliseconds
    lang?: string;
  }>;
  lang: string;
  availableLangs: string[];
}

/**
 * Supadata metadata response structure
 */
interface SupadataMetadataResponse {
  title: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  provider_name?: string;
  provider_url?: string;
  html?: string;
  width?: number;
  height?: number;
  // Extended metadata from YouTube
  description?: string;
  duration?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  published_at?: string;
  channel_id?: string;
}

/**
 * Supadata client interface (for dependency injection)
 */
export interface SupadataClient {
  metadata(options: { url: string }): Promise<SupadataMetadataResponse>;
  transcript(options: {
    url: string;
    mode?: "native" | "auto" | "generate";
    lang?: string;
    text?: boolean;
  }): Promise<SupadataTranscriptResponse>;
}

/**
 * Supadata Extraction Adapter
 *
 * Extracts YouTube video transcripts and metadata using the Supadata API.
 */
export class SupadataExtractionAdapter extends BaseExtractionAdapter {
  readonly serviceId = "supadata";
  readonly supportedSourceTypes = ["youtube"] as const;

  private client: SupadataClient | null = null;
  private config: ExtractionConfig;

  constructor(client?: SupadataClient, config?: Partial<ExtractionConfig>) {
    super();
    this.client = client ?? null;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      validationRules: [
        ...DEFAULT_CONFIG.validationRules,
        ...(config?.validationRules ?? []),
        ...this.getDefaultValidationRules(),
      ],
    };
  }

  /**
   * Set the Supadata client (for lazy initialization)
   */
  setClient(client: SupadataClient): void {
    this.client = client;
  }

  /**
   * Get the Supadata client
   * @throws Error if client is not initialized
   */
  private getClient(): SupadataClient {
    if (!this.client) {
      throw new Error(
        "Supadata client not initialized. Call setClient() first or provide client in constructor.",
      );
    }
    return this.client;
  }

  /**
   * Parse a YouTube URL to extract the video ID
   */
  parseUrl(url: string): ParsedUrl | null {
    if (!url || typeof url !== "string") {
      return null;
    }

    const trimmedUrl = url.trim();
    let videoId: string | null = null;

    for (const pattern of YOUTUBE_PATTERNS) {
      const match = trimmedUrl.match(pattern);
      if (match?.[1]) {
        videoId = match[1];
        break;
      }
    }

    if (!videoId) {
      return null;
    }

    return {
      sourceType: "youtube",
      contentId: videoId,
      normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  /**
   * Check if this adapter can handle the given URL
   */
  canHandle(url: string): boolean {
    return this.parseUrl(url) !== null;
  }

  /**
   * Fetch raw content (transcript) from YouTube via Supadata
   */
  async fetchContent(
    contentId: string,
    options?: FetchContentOptions,
  ): Promise<RawContent> {
    const client = this.getClient();
    const url = `https://www.youtube.com/watch?v=${contentId}`;

    // Fetch transcript
    const transcriptResponse = await client.transcript({
      url,
      mode: "native", // Only existing YouTube transcripts
      lang: options?.preferredLanguage ?? "en",
      text: false, // Return structured format with timestamps
    });

    // Convert to content segments
    const segments: ContentSegment[] = transcriptResponse.content.map(
      (segment) => ({
        text: segment.text,
        offsetMs: segment.offset,
        durationMs: segment.duration,
        language: segment.lang,
      }),
    );

    // Combine all text for full transcript
    const textContent = transcriptResponse.content
      .map((segment) => segment.text)
      .join(" ");

    return {
      contentId,
      sourceType: "youtube",
      textContent,
      segments,
      rawMetadata: {
        lang: transcriptResponse.lang,
        availableLangs: transcriptResponse.availableLangs,
      },
      language: transcriptResponse.lang,
      availableLanguages: transcriptResponse.availableLangs,
    };
  }

  /**
   * Extract metadata from raw content
   */
  async extractMetadata(rawContent: RawContent): Promise<ContentMetadata> {
    const client = this.getClient();
    const url = `https://www.youtube.com/watch?v=${rawContent.contentId}`;

    // Fetch metadata from Supadata
    const metadataResponse = await client.metadata({ url });

    // Extract channel ID from author URL if available
    let channelId: string | undefined;
    if (metadataResponse.author_url) {
      const channelMatch = metadataResponse.author_url.match(
        /youtube\.com\/(?:channel\/|@)([^/?]+)/,
      );
      if (channelMatch) {
        channelId = channelMatch[1];
      }
    }

    // Use channel_id from extended metadata if available
    if (metadataResponse.channel_id) {
      channelId = metadataResponse.channel_id;
    }

    return {
      title: metadataResponse.title,
      description: metadataResponse.description,
      authorName: metadataResponse.author_name,
      channelName: metadataResponse.author_name,
      channelId,
      channelUrl: metadataResponse.author_url,
      durationSeconds: metadataResponse.duration,
      thumbnailUrl: metadataResponse.thumbnail_url,
      viewCount: metadataResponse.view_count,
      likeCount: metadataResponse.like_count,
      commentCount: metadataResponse.comment_count,
      publishedAt: metadataResponse.published_at
        ? new Date(metadataResponse.published_at)
        : undefined,
      language: rawContent.language,
      sourceMetadata: {
        ...metadataResponse,
        transcriptLang: rawContent.language,
        availableLangs: rawContent.availableLanguages,
      },
    };
  }

  /**
   * Get the configuration for this extraction service
   */
  getConfig(): ExtractionConfig {
    return this.config;
  }

  /**
   * Get default validation rules for YouTube content
   */
  private getDefaultValidationRules(): ValidationRule[] {
    return [
      this.createValidationRule(
        "has_title",
        "Content must have a title",
        true,
        (metadata) => {
          if (!metadata.title || metadata.title.trim().length === 0) {
            return {
              code: "MISSING_TITLE",
              message: "Content must have a title",
              field: "title",
            };
          }
          return null;
        },
      ),
      this.createValidationRule(
        "has_duration",
        "Video must have a duration",
        false,
        (metadata) => {
          if (metadata.durationSeconds === undefined) {
            return {
              code: "MISSING_DURATION",
              message: "Video duration could not be determined",
              field: "durationSeconds",
            };
          }
          return null;
        },
      ),
    ];
  }
}

/**
 * Create a Supadata extraction adapter with the given client
 */
export function createSupadataAdapter(
  client: SupadataClient,
  config?: Partial<ExtractionConfig>,
): SupadataExtractionAdapter {
  return new SupadataExtractionAdapter(client, config);
}
