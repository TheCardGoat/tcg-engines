/**
 * Tabstack Extraction Adapter
 *
 * Extraction service adapter for web articles using the Tabstack SDK.
 * This is a skeleton implementation ready for future integration.
 *
 * @see https://docs.tabstack.ai/sdks/typescript/quickstart
 * @see https://docs.tabstack.ai/sdks/typescript/generate
 */

import type {
  ContentMetadata,
  ExtractionConfig,
  FetchContentOptions,
  ParsedUrl,
  RawContent,
  ValidationRule,
} from "../../types/extraction-service";
import { BaseExtractionAdapter } from "./base";

/**
 * Default configuration for Tabstack extraction
 */
const DEFAULT_CONFIG: ExtractionConfig = {
  maxContentLength: 50_000, // 50k characters
  supportedLanguages: ["en"],
  extractionTimeoutMs: 60_000, // 1 minute
  validationRules: [],
};

/**
 * Tabstack client interface (for dependency injection)
 *
 * Based on @tabstack/sdk API:
 * - generate.json() - AI-powered content transformation
 * - extract.markdown() - Convert HTML to markdown
 * - extract.json() - Extract structured data
 */
export interface TabstackClient {
  generate: {
    json<T>(options: {
      url: string;
      schema: Record<string, unknown>;
      instructions: string;
      forceRefresh?: boolean;
    }): Promise<T>;
  };
  extract: {
    markdown(options: { url: string }): Promise<{ markdown: string }>;
    json<T>(options: { url: string; schema: Record<string, unknown> }): Promise<T>;
  };
}

/**
 * Article metadata extracted by Tabstack
 */
interface ArticleMetadata {
  title: string;
  author?: string;
  publishedAt?: string;
  description?: string;
  siteName?: string;
  siteUrl?: string;
  imageUrl?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
  language?: string;
  tags?: string[];
}

/**
 * Tabstack Extraction Adapter
 *
 * Extracts web article content using the Tabstack SDK.
 *
 * @example
 * ```typescript
 * import { Tabstack } from '@tabstack/sdk';
 *
 * const tabstack = new Tabstack({ apiKey: process.env.TABSTACK_API_KEY });
 * const adapter = new TabstackExtractionAdapter(tabstack);
 *
 * const parsed = adapter.parseUrl('https://example.com/article/123');
 * const content = await adapter.fetchContent(parsed.contentId);
 * const metadata = await adapter.extractMetadata(content);
 * ```
 */
export class TabstackExtractionAdapter extends BaseExtractionAdapter {
  readonly serviceId = "tabstack";
  readonly supportedSourceTypes = ["article"] as const;

  private client: TabstackClient | null = null;
  private config: ExtractionConfig;

  constructor(client?: TabstackClient, config?: Partial<ExtractionConfig>) {
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
   * Set the Tabstack client (for lazy initialization)
   */
  setClient(client: TabstackClient): void {
    this.client = client;
  }

  /**
   * Get the Tabstack client
   * @throws Error if client is not initialized
   */
  private getClient(): TabstackClient {
    if (!this.client) {
      throw new Error(
        "Tabstack client not initialized. Call setClient() first or provide client in constructor.",
      );
    }
    return this.client;
  }

  /**
   * Parse a URL to extract the article identifier
   *
   * For articles, the content ID is the normalized URL itself
   * since articles don't have a standard ID format like YouTube videos.
   */
  parseUrl(url: string): ParsedUrl | null {
    if (!url || typeof url !== "string") {
      return null;
    }

    const trimmedUrl = url.trim();

    // Validate URL format
    try {
      const parsed = new URL(trimmedUrl);

      // Exclude known non-article domains
      const excludedDomains = [
        "youtube.com",
        "youtu.be",
        "twitter.com",
        "x.com",
        "facebook.com",
        "instagram.com",
        "tiktok.com",
      ];

      // Check for exact domain match or subdomain match (e.g., www.youtube.com)
      const isExcludedDomain = excludedDomains.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
      );

      if (isExcludedDomain) {
        return null;
      }

      // Normalize URL (remove tracking params, etc.)
      const normalizedUrl = this.normalizeArticleUrl(trimmedUrl);

      return {
        sourceType: "article",
        contentId: normalizedUrl, // Use normalized URL as content ID
        normalizedUrl,
      };
    } catch {
      return null;
    }
  }

  /**
   * Check if this adapter can handle the given URL
   */
  canHandle(url: string): boolean {
    return this.parseUrl(url) !== null;
  }

  /**
   * Fetch raw content from the article via Tabstack
   *
   * Uses Tabstack's extract.markdown() to get clean article content.
   */
  async fetchContent(contentId: string, options?: FetchContentOptions): Promise<RawContent> {
    const client = this.getClient();

    // Extract markdown content
    const { markdown } = await client.extract.markdown({ url: contentId });

    return {
      contentId,
      language: options?.preferredLanguage ?? "en",
      rawMetadata: {
        extractedAt: new Date().toISOString(),
        url: contentId,
      },
      sourceType: "article",
      textContent: markdown,
    };
  }

  /**
   * Extract metadata from raw content
   *
   * Uses Tabstack's generate.json() to extract structured metadata.
   */
  async extractMetadata(rawContent: RawContent): Promise<ContentMetadata> {
    const client = this.getClient();

    // Define schema for metadata extraction
    const metadataSchema = {
      properties: {
        author: { description: "Author name", type: "string" },
        description: {
          description: "Article description or summary",
          type: "string",
        },
        imageUrl: { description: "Featured image URL", type: "string" },
        language: { description: "Content language code", type: "string" },
        publishedAt: {
          description: "Publication date in ISO format",
          type: "string",
        },
        siteName: { description: "Website name", type: "string" },
        tags: {
          description: "Article tags or categories",
          items: { type: "string" },
          type: "array",
        },
        title: { description: "Article title", type: "string" },
        wordCount: { description: "Word count", type: "number" },
      },
      required: ["title"],
      type: "object",
    };

    const metadata = await client.generate.json<ArticleMetadata>({
      instructions:
        "Extract article metadata including title, author, publication date, and other relevant information.",
      schema: metadataSchema,
      url: rawContent.contentId,
    });

    return {
      authorName: metadata.author,
      channelName: metadata.siteName,
      channelUrl: metadata.siteUrl,
      contentLength: rawContent.textContent.length,
      description: metadata.description,
      language: metadata.language ?? rawContent.language,
      publishedAt: metadata.publishedAt ? new Date(metadata.publishedAt) : undefined,
      sourceMetadata: {
        ...metadata,
        readingTimeMinutes: metadata.readingTimeMinutes,
        tags: metadata.tags,
        url: rawContent.contentId,
      },
      thumbnailUrl: metadata.imageUrl,
      title: metadata.title,
    };
  }

  /**
   * Get the configuration for this extraction service
   */
  getConfig(): ExtractionConfig {
    return this.config;
  }

  /**
   * Normalize article URL by removing tracking parameters
   */
  private normalizeArticleUrl(url: string): string {
    try {
      const parsed = new URL(url);

      // Remove common tracking parameters
      const trackingParams = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "ref",
        "source",
        "fbclid",
        "gclid",
        "mc_cid",
        "mc_eid",
      ];

      for (const param of trackingParams) {
        parsed.searchParams.delete(param);
      }

      // Remove hash
      parsed.hash = "";

      return parsed.toString();
    } catch {
      return url;
    }
  }

  /**
   * Get default validation rules for article content
   */
  private getDefaultValidationRules(): ValidationRule[] {
    return [
      this.createValidationRule("has_title", "Article must have a title", true, (metadata) => {
        if (!metadata.title || metadata.title.trim().length === 0) {
          return {
            code: "MISSING_TITLE",
            field: "title",
            message: "Article must have a title",
          };
        }
        return null;
      }),
      this.createValidationRule("has_content", "Article must have content", true, (metadata) => {
        if (metadata.contentLength !== undefined && metadata.contentLength < 100) {
          return {
            code: "INSUFFICIENT_CONTENT",
            field: "contentLength",
            message: "Article content is too short (minimum 100 characters)",
          };
        }
        return null;
      }),
    ];
  }
}

/**
 * Create a Tabstack extraction adapter with the given client
 */
export function createTabstackAdapter(
  client: TabstackClient,
  config?: Partial<ExtractionConfig>,
): TabstackExtractionAdapter {
  return new TabstackExtractionAdapter(client, config);
}
