/**
 * Extraction Service Registry Tests
 *
 * Tests for the extraction service registry.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { ExtractionServiceRegistry } from "../../services/extraction/registry";
import type { ExtractionServiceAdapter } from "../../types/extraction-service";

// Mock adapter factory
const createMockAdapter = (
  serviceId: string,
  sourceTypes: ("youtube" | "article" | "rss" | "http")[],
  urlPattern: RegExp,
): ExtractionServiceAdapter => ({
  canHandle: (url: string) => urlPattern.test(url),
  extractMetadata: async () => ({
    sourceMetadata: {},
    title: "Test Title",
  }),
  fetchContent: async () => ({
    contentId: "test-id",
    rawMetadata: {},
    sourceType: sourceTypes[0],
    textContent: "test content",
  }),
  getConfig: () => ({
    extractionTimeoutMs: 60000,
    supportedLanguages: ["en"],
    validationRules: [],
  }),
  parseUrl: (url: string) => {
    const match = url.match(urlPattern);
    if (!match) {return null;}
    return {
      contentId: match[1] ?? "test-id",
      normalizedUrl: url,
      sourceType: sourceTypes[0],
    };
  },
  serviceId,
  supportedSourceTypes: sourceTypes,
  validateContent: async () => ({
    errors: [],
    isValid: true,
    shouldBlock: false,
  }),
});

describe("ExtractionServiceRegistry", () => {
  let registry: ExtractionServiceRegistry;

  beforeEach(() => {
    registry = new ExtractionServiceRegistry();
  });

  describe("register", () => {
    it("should register an adapter", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);

      expect(registry.size).toBe(1);
      expect(registry.getRegisteredServices()).toContain("test");
    });

    it("should throw error for duplicate service ID", () => {
      const adapter1 = createMockAdapter("test", ["youtube"], /youtube\.com/);
      const adapter2 = createMockAdapter("test", ["article"], /example\.com/);

      registry.register(adapter1);

      expect(() => registry.register(adapter2)).toThrow("already registered");
    });

    it("should throw error for duplicate source type", () => {
      const adapter1 = createMockAdapter("test1", ["youtube"], /youtube\.com/);
      const adapter2 = createMockAdapter("test2", ["youtube"], /youtu\.be/);

      registry.register(adapter1);

      expect(() => registry.register(adapter2)).toThrow("already handled");
    });
  });

  describe("unregister", () => {
    it("should unregister an adapter", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      const result = registry.unregister("test");

      expect(result).toBe(true);
      expect(registry.size).toBe(0);
    });

    it("should return false for non-existent adapter", () => {
      const result = registry.unregister("non-existent");

      expect(result).toBe(false);
    });

    it("should remove source type mappings", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      registry.unregister("test");

      expect(registry.getSupportedSourceTypes()).not.toContain("youtube");
    });
  });

  describe("getAdapter", () => {
    it("should return adapter by service ID", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      const result = registry.getAdapter("test");

      expect(result).toBe(adapter);
    });

    it("should return undefined for non-existent adapter", () => {
      const result = registry.getAdapter("non-existent");

      expect(result).toBeUndefined();
    });
  });

  describe("getAdapterBySourceType", () => {
    it("should return adapter by source type", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      const result = registry.getAdapterBySourceType("youtube");

      expect(result).toBe(adapter);
    });

    it("should return undefined for unsupported source type", () => {
      const result = registry.getAdapterBySourceType("youtube");

      expect(result).toBeUndefined();
    });
  });

  describe("getAdapterForUrl", () => {
    it("should return adapter that can handle URL", () => {
      const youtubeAdapter = createMockAdapter(
        "youtube",
        ["youtube"],
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      );
      const articleAdapter = createMockAdapter(
        "article",
        ["article"],
        /example\.com\/article\/(\d+)/,
      );

      registry.register(youtubeAdapter);
      registry.register(articleAdapter);

      const result = registry.getAdapterForUrl("https://www.youtube.com/watch?v=abc123");

      expect(result).toBe(youtubeAdapter);
    });

    it("should return undefined for unsupported URL", () => {
      const adapter = createMockAdapter("youtube", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      const result = registry.getAdapterForUrl("https://vimeo.com/123456");

      expect(result).toBeUndefined();
    });
  });

  describe("canHandle", () => {
    it("should return true if any adapter can handle URL", () => {
      const adapter = createMockAdapter("youtube", ["youtube"], /youtube\.com/);

      registry.register(adapter);

      expect(registry.canHandle("https://www.youtube.com/watch?v=abc123")).toBe(true);
    });

    it("should return false if no adapter can handle URL", () => {
      expect(registry.canHandle("https://vimeo.com/123456")).toBe(false);
    });
  });

  describe("getSupportedSourceTypes", () => {
    it("should return all supported source types", () => {
      const youtubeAdapter = createMockAdapter("youtube", ["youtube"], /youtube\.com/);
      const articleAdapter = createMockAdapter("article", ["article"], /example\.com/);

      registry.register(youtubeAdapter);
      registry.register(articleAdapter);

      const sourceTypes = registry.getSupportedSourceTypes();

      expect(sourceTypes).toContain("youtube");
      expect(sourceTypes).toContain("article");
    });
  });

  describe("clear", () => {
    it("should remove all adapters", () => {
      const adapter = createMockAdapter("test", ["youtube"], /youtube\.com/);

      registry.register(adapter);
      registry.clear();

      expect(registry.size).toBe(0);
      expect(registry.getRegisteredServices()).toHaveLength(0);
      expect(registry.getSupportedSourceTypes()).toHaveLength(0);
    });
  });
});
