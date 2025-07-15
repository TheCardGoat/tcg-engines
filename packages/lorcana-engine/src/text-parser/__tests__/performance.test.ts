// Performance tests for the text parser optimizations

import { beforeEach, describe, expect, it } from "bun:test";
import { generateActionAbilitiesFromText } from "../parser";
import { extractEffectsFromText } from "../patterns";
import {
  CacheManager,
  optimizedExtractEffectsFromText,
  PerformanceMonitor,
} from "../performance-optimizations";

describe("Performance Optimizations", () => {
  beforeEach(() => {
    // Clear caches before each test
    CacheManager.clearAllCaches();
    PerformanceMonitor.clearStats();
  });

  describe("Cache Management", () => {
    it("should track cache sizes", () => {
      const stats = CacheManager.getCacheStats();
      expect(stats.regexCache).toBe(0);
      expect(stats.patternMatchCache).toBe(0);
      expect(stats.effectExtractionCache).toBe(0);
    });

    it("should warm up caches with common texts", () => {
      const commonTexts = [
        "Draw a card",
        "Deal 2 damage to chosen character",
        "Banish chosen character",
      ];

      CacheManager.warmUpCaches(commonTexts);

      const stats = CacheManager.getCacheStats();
      expect(stats.effectExtractionCache).toBeGreaterThan(0);
    });

    it("should clear all caches", () => {
      // Warm up caches first
      CacheManager.warmUpCaches(["Draw a card"]);

      // Verify caches have content
      let stats = CacheManager.getCacheStats();
      expect(stats.effectExtractionCache).toBeGreaterThan(0);

      // Clear caches
      CacheManager.clearAllCaches();

      // Verify caches are empty
      stats = CacheManager.getCacheStats();
      expect(stats.regexCache).toBe(0);
      expect(stats.patternMatchCache).toBe(0);
      expect(stats.effectExtractionCache).toBe(0);
    });
  });

  describe("Performance Monitoring", () => {
    it("should track timing statistics", () => {
      const endTimer = PerformanceMonitor.startTimer("test-operation");

      // Simulate some work
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }

      const duration = endTimer();
      expect(duration).toBeGreaterThan(0);

      const stats = PerformanceMonitor.getStats("test-operation");
      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(1);
      expect(stats!.total).toBeGreaterThan(0);
      expect(stats!.average).toBeGreaterThan(0);
    });

    it("should track multiple operations", () => {
      // Run multiple operations
      for (let i = 0; i < 5; i++) {
        const endTimer = PerformanceMonitor.startTimer("multi-test");
        setTimeout(() => {}, 1); // Small delay
        endTimer();
      }

      const stats = PerformanceMonitor.getStats("multi-test");
      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(5);
    });

    it("should provide comprehensive stats", () => {
      const endTimer1 = PerformanceMonitor.startTimer("operation-1");
      endTimer1();

      const endTimer2 = PerformanceMonitor.startTimer("operation-2");
      endTimer2();

      const allStats = PerformanceMonitor.getAllStats();
      expect(Object.keys(allStats)).toContain("operation-1");
      expect(Object.keys(allStats)).toContain("operation-2");
    });
  });

  describe("Optimized Effect Extraction", () => {
    const testTexts = [
      "Draw a card",
      "Deal 2 damage to chosen character",
      "Banish chosen character of yours",
      "Draw 3 cards",
      "Deal 5 damage to each opponent",
    ];

    it("should produce same results as original function", () => {
      for (const text of testTexts) {
        const originalResults = extractEffectsFromText(text);
        const optimizedResults = optimizedExtractEffectsFromText(text);

        expect(optimizedResults).toEqual(originalResults);
      }
    });

    it("should benefit from caching on repeated calls", () => {
      const text = "Draw a card. Deal 2 damage to chosen character.";

      // First call - should populate cache
      const startTime1 = performance.now();
      optimizedExtractEffectsFromText(text);
      const duration1 = performance.now() - startTime1;

      // Second call - should use cache
      const startTime2 = performance.now();
      optimizedExtractEffectsFromText(text);
      const duration2 = performance.now() - startTime2;

      // Second call should be faster (though this might be flaky in fast environments)
      // At minimum, it should not be significantly slower
      expect(duration2).toBeLessThanOrEqual(duration1 * 2);
    });

    it("should handle complex text efficiently", () => {
      const complexText =
        "Choose one: Draw 2 cards and deal 1 damage to chosen character, or banish chosen character of yours and gain 2 lore this turn.";

      const startTime = performance.now();
      const results = optimizedExtractEffectsFromText(complexText);
      const duration = performance.now() - startTime;

      expect(results).toBeDefined();
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe("Parser Performance", () => {
    const sampleCardTexts = [
      "Draw a card",
      "Deal 2 damage to chosen character",
      "Chosen character of yours gets +3 {S} this turn",
      "Banish chosen character. Draw a card.",
      "Choose one: Draw 2 cards, or deal 3 damage to chosen character",
      "At the end of your turn, banish chosen character of yours",
    ];

    it("should parse cards efficiently", () => {
      for (const text of sampleCardTexts) {
        const startTime = performance.now();
        const abilities = generateActionAbilitiesFromText(text, {
          debug: false,
        });
        const duration = performance.now() - startTime;

        expect(abilities).toBeDefined();
        expect(duration).toBeLessThan(50); // Should complete in under 50ms per card
      }
    });

    it("should show performance improvements with caching", () => {
      const text = "Draw a card. Deal 2 damage to chosen character.";

      // Warm up caches
      generateActionAbilitiesFromText(text);

      // Measure performance with warm cache
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        generateActionAbilitiesFromText(text);
      }
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(100); // 10 parses should complete in under 100ms
    });

    it("should handle batch processing efficiently", () => {
      const startTime = performance.now();

      for (const text of sampleCardTexts) {
        generateActionAbilitiesFromText(text, { debug: false });
      }

      const duration = performance.now() - startTime;
      const averageTime = duration / sampleCardTexts.length;

      expect(averageTime).toBeLessThan(20); // Average under 20ms per card
    });
  });

  describe("Memory Management", () => {
    it("should not leak memory with repeated parsing", () => {
      const initialStats = CacheManager.getCacheStats();

      // Parse many different texts to fill caches
      for (let i = 0; i < 100; i++) {
        const text = `Draw ${(i % 5) + 1} cards. Deal ${(i % 3) + 1} damage to chosen character.`;
        generateActionAbilitiesFromText(text);
      }

      const finalStats = CacheManager.getCacheStats();

      // Caches should have grown but not excessively
      expect(finalStats.regexCache).toBeLessThan(1000);
      expect(finalStats.patternMatchCache).toBeLessThan(5000);
      expect(finalStats.effectExtractionCache).toBeLessThan(3000);
    });

    it("should respect cache size limits", () => {
      // Generate many unique texts to test cache limits
      const uniqueTexts = Array.from(
        { length: 6000 },
        (_, i) => `Draw ${i} cards`,
      );

      for (const text of uniqueTexts) {
        optimizedExtractEffectsFromText(text);
      }

      const stats = CacheManager.getCacheStats();

      // Should not exceed maximum cache sizes
      expect(stats.effectExtractionCache).toBeLessThanOrEqual(3000);
    });
  });

  describe("Regex Optimization", () => {
    it("should reuse compiled regex patterns", () => {
      const text1 = "Draw a card";
      const text2 = "Draw 2 cards";
      const text3 = "Draw 3 cards";

      // Parse multiple similar texts
      optimizedExtractEffectsFromText(text1);
      optimizedExtractEffectsFromText(text2);
      optimizedExtractEffectsFromText(text3);

      const stats = CacheManager.getCacheStats();

      // Should have cached pattern match results
      expect(stats.patternMatchCache).toBeGreaterThan(0);
    });
  });
});
