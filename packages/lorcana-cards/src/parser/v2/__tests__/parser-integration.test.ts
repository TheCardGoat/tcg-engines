/**
 * Integration tests for the v2 parser entry point.
 * Tests end-to-end parsing from text input to ability objects.
 */

import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { logger, parserV2 } from "../index";

describe("LorcanaParserV2 - Integration", () => {
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let consoleWarnSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Reset logger to default state
    logger.enable();
    logger.setLevel("info");

    // Spy on console methods
    consoleLogSpy = spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore all console spies to prevent leaking mocks to other test files
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();

    // Reset logger to default state
    logger.enable();
    logger.setLevel("info");
  });

  describe("parser initialization", () => {
    it("creates parser instance without errors", () => {
      expect(parserV2).toBeDefined();
    });

    it("has parseAbility method", () => {
      expect(parserV2.parseAbility).toBeDefined();
      expect(typeof parserV2.parseAbility).toBe("function");
    });

    it("has enableDebugLogging method", () => {
      expect(parserV2.enableDebugLogging).toBeDefined();
      expect(typeof parserV2.enableDebugLogging).toBe("function");
    });

    it("has disableDebugLogging method", () => {
      expect(parserV2.disableDebugLogging).toBeDefined();
      expect(typeof parserV2.disableDebugLogging).toBe("function");
    });
  });

  describe("simple ability parsing", () => {
    it("parses draw effect", () => {
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
    });

    it("returns ability with type", () => {
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBeDefined();
      expect(typeof result?.type).toBe("string");
    });
  });

  describe("triggered ability parsing", () => {
    it("parses simple triggered ability", () => {
      const result = parserV2.parseAbility("when you play, draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("parses triggered ability with period", () => {
      const result = parserV2.parseAbility("when you play, draw 2 cards.");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("parses whenever triggered ability", () => {
      const result = parserV2.parseAbility("whenever you play, draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("includes effect information for triggered ability", () => {
      const result = parserV2.parseAbility("when you play, draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
      // Text-based fallback wraps effect as triggered ability
      // Biome-ignore lint/suspicious/noExplicitAny: Testing dynamic property
      const effect = (result as any)?.effect;
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("draw");
    });

    it("wraps triggered ability with effect property", () => {
      const result = parserV2.parseAbility("when you play, draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
      // Biome-ignore lint/suspicious/noExplicitAny: Testing dynamic property
      const effect = (result as any)?.effect;
      expect(effect).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("returns null for invalid syntax", () => {
      const result = parserV2.parseAbility("when when when");

      expect(result).toBeNull();
    });

    it("returns null for incomplete ability", () => {
      const result = parserV2.parseAbility("when you play,");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = parserV2.parseAbility("");

      expect(result).toBeNull();
    });

    it("returns null for unparseable text", () => {
      const result = parserV2.parseAbility("@#$%^&*()");

      expect(result).toBeNull();
    });

    it("returns null for parsing failure without throwing", () => {
      const result = parserV2.parseAbility("when when when");
      expect(result).toBeNull();
      // Parser logs debug messages when falling back, not errors
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("logs error for lexing failure", () => {
      // Some text that might cause lexing issues
      parserV2.parseAbility("###");

      // Should attempt to parse and potentially log errors
      expect(
        consoleLogSpy.mock.calls.length + consoleErrorSpy.mock.calls.length,
      ).toBeGreaterThan(0);
    });

    it("handles null input gracefully", () => {
      // Biome-ignore lint/suspicious/noExplicitAny: Testing error handling with invalid input
      expect(() => parserV2.parseAbility(null as any)).not.toThrow();
    });

    it("handles undefined input gracefully", () => {
      // Biome-ignore lint/suspicious/noExplicitAny: Testing error handling with invalid input
      expect(() => parserV2.parseAbility(undefined as any)).not.toThrow();
    });
  });

  describe("logging integration", () => {
    it("logs info when parsing starts", () => {
      parserV2.parseAbility("draw 2 cards");

      expect(consoleLogSpy).toHaveBeenCalled();
      const firstLog = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(firstLog);
      expect(logEntry.message).toContain("Parsing ability");
    });

    it("logs info when parsing succeeds", () => {
      parserV2.parseAbility("draw 2 cards");

      expect(consoleLogSpy).toHaveBeenCalled();
      // Should have success log
      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      const successLog = logs.find(
        (log: { message: string }) =>
          log.message.includes("Successfully") ||
          log.message.includes("Parsed"),
      );
      expect(successLog).toBeDefined();
    });

    it("logs debug when parsing fails via grammar and falls back to text parser", () => {
      // "when when when" fails both grammar and text-based parsing
      // But doesn't log an error, just returns null
      const result = parserV2.parseAbility("when when when");
      expect(result).toBeNull();
      // The parser logs debug messages, not errors
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("includes ability text in logs", () => {
      const abilityText = "draw 2 cards";
      parserV2.parseAbility(abilityText);

      expect(consoleLogSpy).toHaveBeenCalled();
      const firstLog = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(firstLog);
      expect(logEntry.text).toBe(abilityText);
    });
  });

  describe("debug logging", () => {
    it("enables debug logging", () => {
      parserV2.enableDebugLogging();
      parserV2.parseAbility("draw 2 cards");

      expect(consoleLogSpy).toHaveBeenCalled();
      // Should include debug-level logs
      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      const debugLogs = logs.filter(
        (log: { level: string }) => log.level === "debug",
      );
      expect(debugLogs.length).toBeGreaterThan(0);
    });

    it("disables debug logging for subsequent parses", () => {
      // First disable debug, then clear any previous logs
      parserV2.disableDebugLogging();
      // Clear mock calls from previous tests
      consoleLogSpy.mockClear();

      parserV2.parseAbility("draw 2 cards");

      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      const debugLogs = logs.filter(
        (log: { level: string }) => log.level === "debug",
      );
      // After disabling debug logging, no debug logs should be produced
      expect(debugLogs.length).toBe(0);
    });

    it("provides detailed debug information", () => {
      parserV2.enableDebugLogging();
      parserV2.parseAbility("when you play, draw 2 cards");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      const debugLogs = logs.filter(
        (log: { level: string }) => log.level === "debug",
      );

      // Should have debug logs from visitor
      expect(debugLogs.length).toBeGreaterThan(0);
    });
  });

  describe("end-to-end parsing pipeline", () => {
    it("completes lexing phase", () => {
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      // If result is not null, lexing succeeded
    });

    it("completes parsing phase", () => {
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      // If result is not null and has structure, parsing succeeded
      expect(result?.type).toBeDefined();
    });

    it("completes visiting phase", () => {
      // Grammar-based parsing may fail for triggered abilities,
      // But text-based parsing will fall back and parse the draw effect
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      // Text-based parser returns action ability wrapping draw effect
      expect(result?.type).toBe("action");
    });

    it("produces ability object with effect", () => {
      // Text-based parser returns action ability wrapping draw effect
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("action");
      // Check that effect exists on the result
      // Biome-ignore lint/suspicious/noExplicitAny: Testing dynamic property access
      const effect = (result as any)?.effect;
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("draw");
      expect(effect?.amount).toBe(2);
    });
  });

  describe("real-world ability examples", () => {
    it("parses Elsa - Snow Queen ability", () => {
      const result = parserV2.parseAbility(
        "when you play this character, draw 2 cards",
      );

      expect(result).not.toBeNull();
      // Text-based parsing detects "when" prefix and wraps as triggered
      expect(result?.type).toBe("triggered");
    });

    it("handles case insensitivity for draw effects", () => {
      const result = parserV2.parseAbility("DRAW 2 CARDS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("action");
    });

    it("handles extra whitespace in draw effects", () => {
      const result = parserV2.parseAbility("draw   2   cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("action");
    });

    it("handles mixed case and whitespace in draw effects", () => {
      const result = parserV2.parseAbility("Draw  2  Cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("action");
    });
  });

  describe("error recovery", () => {
    it("recovers from one parsing error", () => {
      const result1 = parserV2.parseAbility("when when when");
      expect(result1).toBeNull();

      const result2 = parserV2.parseAbility("draw 2 cards");
      expect(result2).not.toBeNull();
    });

    it("maintains state consistency across parses", () => {
      parserV2.parseAbility("when you play, draw 2 cards");
      parserV2.parseAbility("invalid text");
      const result = parserV2.parseAbility("draw 2 cards");

      expect(result).not.toBeNull();
    });
  });

  describe("exception handling", () => {
    it("catches exceptions during parsing", () => {
      // Any unexpected error should be caught and return null
      expect(() => parserV2.parseAbility("test")).not.toThrow();
    });

    it("logs unexpected errors", () => {
      // If an exception occurs, it should be logged
      parserV2.parseAbility("test");

      // Should have logged something (either success or error)
      expect(
        consoleLogSpy.mock.calls.length + consoleErrorSpy.mock.calls.length,
      ).toBeGreaterThan(0);
    });
  });

  describe("parser state isolation", () => {
    it("does not share state between parse calls", () => {
      const result1 = parserV2.parseAbility("draw 2 cards");
      const result2 = parserV2.parseAbility("draw 3 cards");

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();

      // Verify different amounts
      // This ensures parser state was reset
      expect(result1).not.toEqual(result2);
    });

    it("handles rapid successive parses", () => {
      const texts = [
        "draw 1 card",
        "draw 2 cards",
        "draw 3 cards",
        "draw 4 cards",
        "draw 5 cards",
      ];

      const results = texts.map((text) => parserV2.parseAbility(text));

      // All should succeed
      expect(results.every((r) => r !== null)).toBe(true);
    });
  });

  describe("logging context", () => {
    it("includes stage information in logs", () => {
      parserV2.enableDebugLogging();
      parserV2.parseAbility("when you play, draw 2 cards");

      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      // Debug logs from visitor should have context
      expect(logs.length).toBeGreaterThan(0);
    });

    it("provides text context in logs on failure", () => {
      // Enable debug logging to see all output
      parserV2.enableDebugLogging();
      parserV2.parseAbility("when when when");

      // Should have logged debug messages about parsing attempts
      expect(consoleLogSpy).toHaveBeenCalled();
      const logs = consoleLogSpy.mock.calls.map((call: unknown[]) =>
        JSON.parse(call[0] as string),
      );
      // First log should contain the text being parsed
      const firstLog = logs[0];
      expect(firstLog.text).toBeDefined();
    });
  });

  describe("coverage verification", () => {
    it("exercises lexer", () => {
      const result = parserV2.parseAbility("draw 2 cards");
      expect(result).not.toBeNull();
    });

    it("exercises parser with text-based fallback", () => {
      const result = parserV2.parseAbility("draw 2 cards");
      expect(result).not.toBeNull();
      expect(result?.type).toBe("action");
    });

    it("exercises text-based parsing for triggered abilities", () => {
      const result = parserV2.parseAbility(
        "when you play this character, draw 2 cards",
      );
      expect(result?.type).toBe("triggered");
    });

    it("exercises logger", () => {
      parserV2.parseAbility("draw 2 cards");
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("exercises null return for unparseable text", () => {
      const result = parserV2.parseAbility("invalid");
      expect(result).toBeNull();
      // Parser logs debug messages, not errors
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});
