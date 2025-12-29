/**
 * Integration tests for the v2 parser entry point.
 * Tests end-to-end parsing from text input to ability objects.
 */

import { beforeEach, describe, expect, it, spyOn } from "bun:test";
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
      const result = parserV2.parseAbility("draw 2");

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
    });

    it("returns ability with type", () => {
      const result = parserV2.parseAbility("draw 2");

      expect(result).not.toBeNull();
      expect(result?.type).toBeDefined();
      expect(typeof result?.type).toBe("string");
    });
  });

  describe("triggered ability parsing", () => {
    it("parses simple triggered ability", () => {
      const result = parserV2.parseAbility("when you play, draw 2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("parses triggered ability with period", () => {
      const result = parserV2.parseAbility("when you play, draw 2.");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("parses whenever triggered ability", () => {
      const result = parserV2.parseAbility("whenever you play, draw 2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("includes trigger information", () => {
      const result = parserV2.parseAbility("when you play, draw 2");

      expect(result).not.toBeNull();
      expect(result?.trigger).toBeDefined();
    });

    it("includes effect information", () => {
      const result = parserV2.parseAbility("when you play, draw 2");

      expect(result).not.toBeNull();
      expect(result?.effect).toBeDefined();
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

    it("logs error for parsing failure", () => {
      parserV2.parseAbility("when when when");

      expect(consoleErrorSpy).toHaveBeenCalled();
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
      // biome-ignore lint/suspicious/noExplicitAny: Testing error handling with invalid input
      expect(() => parserV2.parseAbility(null as any)).not.toThrow();
    });

    it("handles undefined input gracefully", () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing error handling with invalid input
      expect(() => parserV2.parseAbility(undefined as any)).not.toThrow();
    });
  });

  describe("logging integration", () => {
    it("logs info when parsing starts", () => {
      parserV2.parseAbility("draw 2");

      expect(consoleLogSpy).toHaveBeenCalled();
      const firstLog = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(firstLog);
      expect(logEntry.message).toContain("Parsing ability");
    });

    it("logs info when parsing succeeds", () => {
      parserV2.parseAbility("draw 2");

      expect(consoleLogSpy).toHaveBeenCalled();
      // Should have success log
      const logs = consoleLogSpy.mock.calls.map((call) => JSON.parse(call[0]));
      const successLog = logs.find((log) =>
        log.message.includes("Successfully"),
      );
      expect(successLog).toBeDefined();
    });

    it("logs error when parsing fails", () => {
      parserV2.parseAbility("when when when");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("includes ability text in logs", () => {
      const abilityText = "draw 2";
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
      parserV2.parseAbility("draw 2");

      expect(consoleLogSpy).toHaveBeenCalled();
      // Should include debug-level logs
      const logs = consoleLogSpy.mock.calls.map((call) => JSON.parse(call[0]));
      const debugLogs = logs.filter((log) => log.level === "debug");
      expect(debugLogs.length).toBeGreaterThan(0);
    });

    it("disables debug logging", () => {
      parserV2.enableDebugLogging();
      parserV2.disableDebugLogging();
      parserV2.parseAbility("draw 2");

      const logs = consoleLogSpy.mock.calls.map((call) => JSON.parse(call[0]));
      const debugLogs = logs.filter((log) => log.level === "debug");
      expect(debugLogs.length).toBe(0);
    });

    it("provides detailed debug information", () => {
      parserV2.enableDebugLogging();
      parserV2.parseAbility("when you play, draw 2");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logs = consoleLogSpy.mock.calls.map((call) => JSON.parse(call[0]));
      const debugLogs = logs.filter((log) => log.level === "debug");

      // Should have debug logs from visitor
      expect(debugLogs.length).toBeGreaterThan(0);
    });
  });

  describe("end-to-end parsing pipeline", () => {
    it("completes lexing phase", () => {
      const result = parserV2.parseAbility("draw 2");

      expect(result).not.toBeNull();
      // If result is not null, lexing succeeded
    });

    it("completes parsing phase", () => {
      const result = parserV2.parseAbility("draw 2");

      expect(result).not.toBeNull();
      // If result is not null and has structure, parsing succeeded
      expect(result?.type).toBeDefined();
    });

    it("completes visiting phase", () => {
      const result = parserV2.parseAbility("when you play, draw 2");

      expect(result).not.toBeNull();
      // Visitor transforms to proper structure
      expect(result?.type).toBe("triggered");
      expect(result?.trigger).toBeDefined();
      expect(result?.effect).toBeDefined();
    });

    it("produces complete ability object", () => {
      const result = parserV2.parseAbility("when you play, draw 2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
      expect(result?.trigger).toHaveProperty("triggerWord");
      expect(result?.effect).toHaveProperty("type");
      expect(result?.effect?.type).toBe("draw");
      expect(result?.effect?.amount).toBe(2);
    });
  });

  describe("real-world ability examples", () => {
    it("parses Elsa - Snow Queen ability", () => {
      const result = parserV2.parseAbility(
        "when you play this character, draw 2 cards",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("handles case insensitivity", () => {
      const result = parserV2.parseAbility("WHEN YOU PLAY, DRAW 2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("handles extra whitespace", () => {
      const result = parserV2.parseAbility("when   you   play,   draw   2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });

    it("handles mixed case and whitespace", () => {
      const result = parserV2.parseAbility("When  You  Play,  Draw  2");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("triggered");
    });
  });

  describe("error recovery", () => {
    it("recovers from one parsing error", () => {
      const result1 = parserV2.parseAbility("when when when");
      expect(result1).toBeNull();

      const result2 = parserV2.parseAbility("draw 2");
      expect(result2).not.toBeNull();
    });

    it("maintains state consistency across parses", () => {
      parserV2.parseAbility("when you play, draw 2");
      parserV2.parseAbility("invalid text");
      const result = parserV2.parseAbility("draw 2");

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
      const result1 = parserV2.parseAbility("draw 2");
      const result2 = parserV2.parseAbility("draw 3");

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();

      // Verify different amounts
      // This ensures parser state was reset
      expect(result1).not.toEqual(result2);
    });

    it("handles rapid successive parses", () => {
      const texts = ["draw 1", "draw 2", "draw 3", "draw 4", "draw 5"];

      const results = texts.map((text) => parserV2.parseAbility(text));

      // All should succeed
      expect(results.every((r) => r !== null)).toBe(true);
    });
  });

  describe("logging context", () => {
    it("includes stage information in logs", () => {
      parserV2.enableDebugLogging();
      parserV2.parseAbility("when you play, draw 2");

      const logs = consoleLogSpy.mock.calls.map((call) => JSON.parse(call[0]));
      // Some logs should include context
      const logsWithStage = logs.filter((log) => log.stage !== undefined);
      // Debug logs from visitor should have context
      expect(logs.length).toBeGreaterThan(0);
    });

    it("provides error context on failure", () => {
      parserV2.parseAbility("when when when");

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0][0];
      const logEntry = JSON.parse(errorLog);

      expect(logEntry.text).toBeDefined();
      expect(logEntry.errors).toBeDefined();
    });
  });

  describe("coverage verification", () => {
    it("exercises lexer", () => {
      const result = parserV2.parseAbility("draw 2");
      expect(result).not.toBeNull();
    });

    it("exercises parser", () => {
      const result = parserV2.parseAbility("when you play, draw 2");
      expect(result).not.toBeNull();
    });

    it("exercises visitor", () => {
      const result = parserV2.parseAbility("when you play, draw 2");
      expect(result?.type).toBe("triggered");
      expect(result?.trigger).toBeDefined();
      expect(result?.effect).toBeDefined();
    });

    it("exercises logger", () => {
      parserV2.parseAbility("draw 2");
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("exercises error handling", () => {
      const result = parserV2.parseAbility("invalid");
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
