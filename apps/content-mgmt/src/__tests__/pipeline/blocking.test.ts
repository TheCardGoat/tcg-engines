/**
 * Pipeline Blocking Behavior Tests
 *
 * Tests for the content ingestion pipeline blocking mechanism.
 */

import { beforeEach, describe, expect, it, mock } from "bun:test";
import { extractionServiceRegistry } from "../../services/extraction/registry";
import {
  ContentIngestionService,
  type PipelineStageHandlers,
} from "../../services/pipeline/content-ingestion";
import type { ExtractionServiceAdapter } from "../../types/extraction-service";

// Mock adapter that can be configured to block
const createMockAdapter = (options: {
  shouldBlock?: boolean;
  blockReason?: string;
  validationErrors?: Array<{ code: string; message: string }>;
}): ExtractionServiceAdapter => ({
  serviceId: "mock",
  supportedSourceTypes: ["youtube"],
  parseUrl: (url: string) => {
    if (!url.includes("youtube.com")) return null;
    return {
      sourceType: "youtube",
      contentId: "test-video-id",
      normalizedUrl: url,
    };
  },
  canHandle: (url: string) => url.includes("youtube.com"),
  fetchContent: async () => ({
    contentId: "test-video-id",
    sourceType: "youtube",
    textContent: "Test transcript content",
    rawMetadata: {},
  }),
  extractMetadata: async () => ({
    title: "Test Video",
    durationSeconds: 600,
    sourceMetadata: {},
  }),
  validateContent: async () => ({
    isValid: !options.shouldBlock,
    shouldBlock: options.shouldBlock ?? false,
    errors: options.validationErrors ?? [],
  }),
  getConfig: () => ({
    maxDurationSeconds: 1800,
    supportedLanguages: ["en"],
    extractionTimeoutMs: 60000,
    validationRules: [],
  }),
});

describe("Pipeline Blocking Behavior", () => {
  let service: ContentIngestionService;
  let handlers: PipelineStageHandlers;
  let onBlockedMock: ReturnType<typeof mock>;

  beforeEach(() => {
    // Clear the global registry
    extractionServiceRegistry.clear();

    onBlockedMock = mock(() => Promise.resolve());
    handlers = {
      onBlocked: onBlockedMock,
    };

    service = new ContentIngestionService(handlers);
  });

  describe("Extraction Stage Blocking", () => {
    it("should block content when validation fails with shouldBlock=true", async () => {
      const adapter = createMockAdapter({
        shouldBlock: true,
        validationErrors: [
          { code: "CONTENT_TOO_LONG", message: "Video exceeds 30 minutes" },
        ],
      });

      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blocked).toBe(true);
      expect(result.blockedAtStage).toBe("extraction");
      expect(result.success).toBe(false);
    });

    it("should call onBlocked handler when content is blocked", async () => {
      const adapter = createMockAdapter({
        shouldBlock: true,
        validationErrors: [
          { code: "UNSUPPORTED_LANGUAGE", message: "Language not supported" },
        ],
      });

      extractionServiceRegistry.register(adapter);

      await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(onBlockedMock).toHaveBeenCalled();
    });

    it("should not block content when validation passes", async () => {
      const adapter = createMockAdapter({
        shouldBlock: false,
      });

      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blocked).toBe(false);
      expect(result.blockedAtStage).toBeUndefined();
    });
  });

  describe("URL Validation Blocking", () => {
    it("should block when no adapter can handle URL", async () => {
      // Don't register any adapters

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blocked).toBe(true);
      expect(result.blockedAtStage).toBe("extraction");
      expect(result.blockReason).toContain("No extraction service");
    });

    it("should block when URL format is invalid", async () => {
      const adapter = createMockAdapter({});
      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://vimeo.com/123456",
        "user-123",
      );

      expect(result.blocked).toBe(true);
      expect(result.blockedAtStage).toBe("extraction");
    });
  });

  describe("Blocking Error Codes", () => {
    it("should block on CONTENT_TOO_LONG error", async () => {
      const adapter = createMockAdapter({
        shouldBlock: true,
        validationErrors: [
          { code: "CONTENT_TOO_LONG", message: "Content exceeds limit" },
        ],
      });

      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blocked).toBe(true);
    });

    it("should block on UNSUPPORTED_LANGUAGE error", async () => {
      const adapter = createMockAdapter({
        shouldBlock: true,
        validationErrors: [
          { code: "UNSUPPORTED_LANGUAGE", message: "Language not supported" },
        ],
      });

      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blocked).toBe(true);
    });
  });

  describe("Pipeline Result Structure", () => {
    it("should include extraction result when not blocked", async () => {
      const adapter = createMockAdapter({});
      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.extraction).toBeDefined();
      expect(result.extraction?.contentId).toBe("test-video-id");
    });

    it("should include block reason when blocked", async () => {
      const adapter = createMockAdapter({
        shouldBlock: true,
        validationErrors: [
          { code: "POLICY_VIOLATION", message: "Content violates policy" },
        ],
      });

      extractionServiceRegistry.register(adapter);

      const result = await service.ingestContent(
        "https://www.youtube.com/watch?v=abc123",
        "user-123",
      );

      expect(result.blockReason).toBeDefined();
      expect(result.blockReason).toContain("violates policy");
    });
  });
});
