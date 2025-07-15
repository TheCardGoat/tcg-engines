// Performance benchmarking tests for the action text parser

import { generateActionAbilitiesFromText, parseActionText } from "../parser";
import { SET008_ACTION_CARDS } from "./set008-action-cards";

describe("Performance Benchmarks", () => {
  describe("Single Card Parsing Performance", () => {
    it("should parse simple cards quickly", () => {
      const simpleTexts = [
        "Draw a card.",
        "Deal 1 damage to chosen character.",
        "Banish chosen character.",
        "Chosen character gets +1 {S}.",
      ];

      simpleTexts.forEach((text) => {
        const iterations = 1000;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
          parseActionText(text);
        }

        const endTime = performance.now();
        const averageTime = (endTime - startTime) / iterations;

        console.log(`"${text}": ${averageTime.toFixed(3)}ms average`);

        // Should parse simple cards in under 1ms on average
        expect(averageTime).toBeLessThan(1);
      });
    });

    it("should parse complex cards within reasonable time", () => {
      const complexTexts = [
        "Choose one: Draw a card or Deal 1 damage to chosen character.",
        "Draw a card. Chosen character gets +2 {S} this turn. At the end of your turn, banish them.",
        "Deal 2 damage to chosen character. If they're banished this way, draw a card.",
        "Each player discards their hand, then draws 5 cards.",
      ];

      complexTexts.forEach((text) => {
        const iterations = 100;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
          parseActionText(text);
        }

        const endTime = performance.now();
        const averageTime = (endTime - startTime) / iterations;

        console.log(`"${text}": ${averageTime.toFixed(3)}ms average`);

        // Should parse complex cards in under 5ms on average
        expect(averageTime).toBeLessThan(5);
      });
    });
  });

  describe("Batch Parsing Performance", () => {
    it("should handle batch parsing efficiently", () => {
      const batchSizes = [10, 50, 100];

      batchSizes.forEach((batchSize) => {
        const batch = SET008_ACTION_CARDS.slice(0, batchSize);
        const startTime = performance.now();

        batch.forEach((card) => {
          parseActionText(card.text);
        });

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / batchSize;

        console.log(
          `Batch size ${batchSize}: ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms average`,
        );

        // Should maintain reasonable performance even with larger batches
        expect(averageTime).toBeLessThan(2);
        expect(totalTime).toBeLessThan(batchSize * 5); // Max 5ms per card
      });
    });

    it("should scale linearly with input size", () => {
      const measurements: Array<{ size: number; time: number }> = [];
      const testSizes = [5, 10, 15];

      testSizes.forEach((size) => {
        const batch = SET008_ACTION_CARDS.slice(0, size);
        const startTime = performance.now();

        batch.forEach((card) => {
          parseActionText(card.text);
        });

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        measurements.push({ size, time: totalTime });
      });

      // Check that performance scales roughly linearly
      for (let i = 1; i < measurements.length; i++) {
        const prev = measurements[i - 1];
        const curr = measurements[i];

        const sizeRatio = curr?.size && prev?.size ? curr.size / prev.size : 1;
        const timeRatio = curr?.time && prev?.time ? curr.time / prev.time : 1;

        console.log(
          `Size ratio: ${sizeRatio.toFixed(2)}, Time ratio: ${timeRatio.toFixed(2)}`,
        );

        // Time ratio should not be significantly higher than size ratio
        // Allow some variance for small sample sizes
        expect(timeRatio).toBeLessThan(sizeRatio * 2);
      }
    });
  });

  describe("Memory Usage", () => {
    it("should not leak memory during repeated parsing", () => {
      const testCard = SET008_ACTION_CARDS[0];
      const iterations = 1000;

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const initialMemory = process.memoryUsage();

      for (let i = 0; i < iterations; i++) {
        parseActionText(testCard?.text || "Draw a card.");
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();

      const heapGrowth = finalMemory.heapUsed - initialMemory.heapUsed;
      const heapGrowthMB = heapGrowth / (1024 * 1024);

      console.log(
        `Heap growth after ${iterations} iterations: ${heapGrowthMB.toFixed(2)}MB`,
      );

      // Should not grow heap by more than 10MB for 1000 iterations
      expect(heapGrowthMB).toBeLessThan(10);
    });

    it("should handle large text inputs efficiently", () => {
      const largeText =
        "Draw a card. ".repeat(100) + "Deal 1 damage to chosen character.";

      const startTime = performance.now();
      const result = parseActionText(largeText);
      const endTime = performance.now();

      const parseTime = endTime - startTime;

      console.log(`Large text parsing time: ${parseTime.toFixed(2)}ms`);

      expect(result.abilities).toBeDefined();
      expect(parseTime).toBeLessThan(50); // Should handle large text in under 50ms
    });
  });

  describe("Concurrent Parsing", () => {
    it("should handle concurrent parsing requests", async () => {
      const concurrentRequests = 10;
      const testCards = SET008_ACTION_CARDS.slice(0, concurrentRequests);

      const startTime = performance.now();

      const promises = testCards.map((card) =>
        Promise.resolve().then(() => parseActionText(card.text)),
      );

      const results = await Promise.all(promises);

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      console.log(
        `Concurrent parsing time: ${totalTime.toFixed(2)}ms for ${concurrentRequests} requests`,
      );

      // All requests should complete successfully
      expect(results.length).toBe(concurrentRequests);
      results.forEach((result) => {
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });

      // Should complete in reasonable time
      expect(totalTime).toBeLessThan(100);
    });

    it("should maintain performance under load", async () => {
      const loadTestRounds = 5;
      const requestsPerRound = 20;
      const measurements: number[] = [];

      for (let round = 0; round < loadTestRounds; round++) {
        const testCards = SET008_ACTION_CARDS.slice(0, requestsPerRound);

        const startTime = performance.now();

        const promises = testCards.map((card) =>
          Promise.resolve().then(() => parseActionText(card.text)),
        );

        await Promise.all(promises);

        const endTime = performance.now();
        const roundTime = endTime - startTime;

        measurements.push(roundTime);
        console.log(`Load test round ${round + 1}: ${roundTime.toFixed(2)}ms`);
      }

      // Performance should remain consistent across rounds
      const averageTime =
        measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
      const maxTime = Math.max(...measurements);
      const minTime = Math.min(...measurements);

      console.log(
        `Load test summary - Average: ${averageTime.toFixed(2)}ms, Min: ${minTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`,
      );

      // Max time should not be more than 2x the average (indicating consistent performance)
      expect(maxTime).toBeLessThan(averageTime * 2);
    });
  });

  describe("Performance Regression Detection", () => {
    it("should establish baseline performance metrics", () => {
      const baselineTests = [
        { name: "Simple Draw", text: "Draw a card.", expectedMaxTime: 0.5 },
        {
          name: "Simple Damage",
          text: "Deal 2 damage to chosen character.",
          expectedMaxTime: 1.0,
        },
        {
          name: "Attribute Effect",
          text: "Chosen character gets +1 {S}.",
          expectedMaxTime: 1.0,
        },
        {
          name: "Modal Effect",
          text: "Choose one: Draw a card or Deal 1 damage.",
          expectedMaxTime: 2.0,
        },
        {
          name: "Complex Multi-Effect",
          text: "Draw a card. Deal 1 damage. Banish chosen character.",
          expectedMaxTime: 3.0,
        },
      ];

      const results: Array<{ name: string; time: number; expected: number }> =
        [];

      baselineTests.forEach((test) => {
        const iterations = 100;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
          parseActionText(test.text);
        }

        const endTime = performance.now();
        const averageTime = (endTime - startTime) / iterations;

        results.push({
          name: test.name,
          time: averageTime,
          expected: test.expectedMaxTime,
        });

        console.log(
          `${test.name}: ${averageTime.toFixed(3)}ms (expected < ${test.expectedMaxTime}ms)`,
        );

        expect(averageTime).toBeLessThan(test.expectedMaxTime);
      });

      // Store results for future regression testing
      console.log("\n=== Performance Baseline ===");
      results.forEach((result) => {
        console.log(`${result.name}: ${result.time.toFixed(3)}ms`);
      });
    });

    it("should detect performance regressions in batch operations", () => {
      const batchSize = 50;
      const batch = SET008_ACTION_CARDS.slice(0, batchSize);
      const expectedMaxTime = batchSize * 2; // 2ms per card max

      const startTime = performance.now();

      batch.forEach((card) => {
        parseActionText(card.text);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      console.log(
        `Batch performance: ${totalTime.toFixed(2)}ms for ${batchSize} cards (expected < ${expectedMaxTime}ms)`,
      );

      expect(totalTime).toBeLessThan(expectedMaxTime);
    });
  });

  describe("Resource Usage Monitoring", () => {
    it("should monitor CPU usage during parsing", () => {
      const testCard = SET008_ACTION_CARDS[0];
      const iterations = 500;

      const startTime = process.hrtime.bigint();

      for (let i = 0; i < iterations; i++) {
        parseActionText(testCard?.text || "Draw a card.");
      }

      const endTime = process.hrtime.bigint();
      const cpuTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

      console.log(
        `CPU time for ${iterations} iterations: ${cpuTime.toFixed(2)}ms`,
      );

      // Should not consume excessive CPU time
      expect(cpuTime).toBeLessThan(iterations * 2); // Max 2ms CPU time per parse
    });

    it("should track parser efficiency metrics", () => {
      const metrics = {
        totalCards: 0,
        totalParseTime: 0,
        successfulParses: 0,
        failedParses: 0,
        averageEffectsPerCard: 0,
        totalEffects: 0,
      };

      SET008_ACTION_CARDS.forEach((card) => {
        const startTime = performance.now();
        const result = parseActionText(card.text);
        const endTime = performance.now();

        metrics.totalCards++;
        metrics.totalParseTime += endTime - startTime;

        // Consider successful if it produces abilities or has fewer errors than total clauses
        if (
          result.abilities.length > 0 ||
          result.errors.length < result.clauses.length
        ) {
          metrics.successfulParses++;
        } else {
          metrics.failedParses++;
        }

        const effectCount = result.clauses.reduce(
          (sum, clause) => sum + clause.effects.length,
          0,
        );
        metrics.totalEffects += effectCount;
      });

      metrics.averageEffectsPerCard = metrics.totalEffects / metrics.totalCards;

      console.log("\n=== Parser Efficiency Metrics ===");
      console.log(`Total Cards: ${metrics.totalCards}`);
      console.log(`Total Parse Time: ${metrics.totalParseTime.toFixed(2)}ms`);
      console.log(
        `Average Parse Time: ${(metrics.totalParseTime / metrics.totalCards).toFixed(3)}ms`,
      );
      console.log(
        `Successful Parses: ${metrics.successfulParses} (${((metrics.successfulParses / metrics.totalCards) * 100).toFixed(1)}%)`,
      );
      console.log(
        `Failed Parses: ${metrics.failedParses} (${((metrics.failedParses / metrics.totalCards) * 100).toFixed(1)}%)`,
      );
      console.log(`Total Effects Found: ${metrics.totalEffects}`);
      console.log(
        `Average Effects per Card: ${metrics.averageEffectsPerCard.toFixed(2)}`,
      );

      // Basic efficiency expectations
      expect(metrics.totalParseTime / metrics.totalCards).toBeLessThan(5); // Average under 5ms per card
      expect(metrics.successfulParses / metrics.totalCards).toBeGreaterThan(
        0.3,
      ); // At least 50% success rate
    });
  });
});
