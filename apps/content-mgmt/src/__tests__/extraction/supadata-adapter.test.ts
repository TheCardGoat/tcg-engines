/**
 * Supadata Extraction Adapter Tests
 *
 * Tests for the YouTube extraction adapter using Supadata API.
 */

import { beforeEach, describe, expect, it, mock } from "bun:test";
import {
  type SupadataClient,
  SupadataExtractionAdapter,
} from "../../services/extraction/supadata-adapter";

// Mock Supadata client
const createMockClient = (): SupadataClient => ({
  metadata: mock(() =>
    Promise.resolve({
      title: "Test Video Title",
      author_name: "Test Channel",
      author_url: "https://www.youtube.com/channel/UC123",
      thumbnail_url: "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
      description: "Test video description",
      duration: 600, // 10 minutes
      view_count: 10_000,
      like_count: 500,
      comment_count: 100,
      published_at: "2024-01-15T10:00:00Z",
      channel_id: "UC123",
    }),
  ),
  transcript: mock(() =>
    Promise.resolve({
      availableLangs: ["en", "es"],
      content: [
        { duration: 2000, offset: 0, text: "Hello everyone" },
        { duration: 3000, offset: 2000, text: "Welcome to my video" },
        { duration: 2500, offset: 5000, text: "Today we will discuss" },
      ],
      lang: "en",
    }),
  ),
});

describe("SupadataExtractionAdapter", () => {
  let adapter: SupadataExtractionAdapter;
  let mockClient: SupadataClient;

  beforeEach(() => {
    mockClient = createMockClient();
    adapter = new SupadataExtractionAdapter(mockClient);
  });

  describe("parseUrl", () => {
    it("should parse standard YouTube URL", () => {
      const result = adapter.parseUrl("https://www.youtube.com/watch?v=abc123def45");

      expect(result).not.toBeNull();
      expect(result?.sourceType).toBe("youtube");
      expect(result?.contentId).toBe("abc123def45");
      expect(result?.normalizedUrl).toBe("https://www.youtube.com/watch?v=abc123def45");
    });

    it("should parse short YouTube URL", () => {
      const result = adapter.parseUrl("https://youtu.be/abc123def45");

      expect(result).not.toBeNull();
      expect(result?.contentId).toBe("abc123def45");
    });

    it("should parse mobile YouTube URL", () => {
      const result = adapter.parseUrl("https://m.youtube.com/watch?v=abc123def45");

      expect(result).not.toBeNull();
      expect(result?.contentId).toBe("abc123def45");
    });

    it("should parse YouTube Shorts URL", () => {
      const result = adapter.parseUrl("https://www.youtube.com/shorts/abc123def45");

      expect(result).not.toBeNull();
      expect(result?.contentId).toBe("abc123def45");
    });

    it("should parse embed URL", () => {
      const result = adapter.parseUrl("https://www.youtube.com/embed/abc123def45");

      expect(result).not.toBeNull();
      expect(result?.contentId).toBe("abc123def45");
    });

    it("should parse live URL", () => {
      const result = adapter.parseUrl("https://www.youtube.com/live/abc123def45");

      expect(result).not.toBeNull();
      expect(result?.contentId).toBe("abc123def45");
    });

    it("should strip extra query parameters", () => {
      const result = adapter.parseUrl(
        "https://www.youtube.com/watch?v=abc123def45&t=120&list=PLxyz",
      );

      expect(result).not.toBeNull();
      expect(result?.normalizedUrl).toBe("https://www.youtube.com/watch?v=abc123def45");
    });

    it("should return null for invalid URL", () => {
      const result = adapter.parseUrl("https://example.com/video");

      expect(result).toBeNull();
    });

    it("should return null for empty URL", () => {
      const result = adapter.parseUrl("");

      expect(result).toBeNull();
    });
  });

  describe("canHandle", () => {
    it("should return true for YouTube URLs", () => {
      expect(adapter.canHandle("https://www.youtube.com/watch?v=abc123def45")).toBe(true);
      expect(adapter.canHandle("https://youtu.be/abc123def45")).toBe(true);
    });

    it("should return false for non-YouTube URLs", () => {
      expect(adapter.canHandle("https://vimeo.com/123456")).toBe(false);
      expect(adapter.canHandle("https://example.com")).toBe(false);
    });
  });

  describe("fetchContent", () => {
    it("should fetch transcript from Supadata", async () => {
      const result = await adapter.fetchContent("abc123def45");

      expect(result.contentId).toBe("abc123def45");
      expect(result.sourceType).toBe("youtube");
      expect(result.textContent).toContain("Hello everyone");
      expect(result.segments).toHaveLength(3);
      expect(result.language).toBe("en");
      expect(result.availableLanguages).toContain("es");
    });

    it("should include segment timestamps", async () => {
      const result = await adapter.fetchContent("abc123def45");

      expect(result.segments?.[0]).toEqual({
        durationMs: 2000,
        language: undefined,
        offsetMs: 0,
        text: "Hello everyone",
      });
    });
  });

  describe("extractMetadata", () => {
    it("should extract metadata from raw content", async () => {
      const rawContent = await adapter.fetchContent("abc123def45");
      const metadata = await adapter.extractMetadata(rawContent);

      expect(metadata.title).toBe("Test Video Title");
      expect(metadata.authorName).toBe("Test Channel");
      expect(metadata.channelId).toBe("UC123");
      expect(metadata.durationSeconds).toBe(600);
      expect(metadata.viewCount).toBe(10_000);
      expect(metadata.thumbnailUrl).toContain("ytimg.com");
    });
  });

  describe("validateContent", () => {
    it("should pass validation for valid content", async () => {
      const rawContent = await adapter.fetchContent("abc123def45");
      const metadata = await adapter.extractMetadata(rawContent);
      const validation = await adapter.validateContent(metadata);

      expect(validation.isValid).toBe(true);
      expect(validation.shouldBlock).toBe(false);
      expect(validation.errors).toHaveLength(0);
    });

    it("should fail validation for content exceeding max duration", async () => {
      // Create adapter with short max duration
      const shortAdapter = new SupadataExtractionAdapter(mockClient, {
        maxDurationSeconds: 300, // 5 minutes
      });

      const rawContent = await shortAdapter.fetchContent("abc123def45");
      const metadata = await shortAdapter.extractMetadata(rawContent);
      const validation = await shortAdapter.validateContent(metadata);

      expect(validation.isValid).toBe(false);
      expect(validation.shouldBlock).toBe(true);
      expect(validation.errors.some((e) => e.code === "CONTENT_TOO_LONG")).toBe(true);
    });

    it("should fail validation for missing title", async () => {
      // Mock client that returns empty title
      const emptyTitleClient: SupadataClient = {
        ...mockClient,
        metadata: mock(() =>
          Promise.resolve({
            author_name: "Test Channel",
            title: "",
          }),
        ),
      };

      const emptyAdapter = new SupadataExtractionAdapter(emptyTitleClient);
      const rawContent = await emptyAdapter.fetchContent("abc123def45");
      const metadata = await emptyAdapter.extractMetadata(rawContent);
      const validation = await emptyAdapter.validateContent(metadata);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.code === "MISSING_TITLE")).toBe(true);
    });
  });

  describe("getConfig", () => {
    it("should return default configuration", () => {
      const config = adapter.getConfig();

      expect(config.maxDurationSeconds).toBe(1800); // 30 minutes
      expect(config.supportedLanguages).toContain("en");
      expect(config.extractionTimeoutMs).toBe(60_000);
    });

    it("should allow custom configuration", () => {
      const customAdapter = new SupadataExtractionAdapter(mockClient, {
        maxDurationSeconds: 900,
        supportedLanguages: ["en", "es", "fr"],
      });

      const config = customAdapter.getConfig();

      expect(config.maxDurationSeconds).toBe(900);
      expect(config.supportedLanguages).toContain("fr");
    });
  });
});
