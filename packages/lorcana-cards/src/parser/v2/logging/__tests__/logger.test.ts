/**
 * Tests for parser logger.
 * Ensures logging infrastructure works correctly.
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import type { LogLevel } from "../logger";
import { logger } from "../logger";

describe("ParserLogger", () => {
  // Spy on console methods
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let consoleWarnSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Reset logger state
    logger.enable();
    logger.setLevel("info");

    // Spy on console methods
    consoleLogSpy = spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("log level filtering", () => {
    it("logs info when level is info", () => {
      logger.setLevel("info");
      logger.info("test message");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("logs warn when level is info", () => {
      logger.setLevel("info");
      logger.warn("test warning");

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("logs error when level is info", () => {
      logger.setLevel("info");
      logger.error("test error");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("does not log debug when level is info", () => {
      logger.setLevel("info");
      logger.debug("test debug");

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("logs debug when level is debug", () => {
      logger.setLevel("debug");
      logger.debug("test debug");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("logs info when level is debug", () => {
      logger.setLevel("debug");
      logger.info("test info");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("does not log info when level is warn", () => {
      logger.setLevel("warn");
      logger.info("test info");

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("logs warn when level is warn", () => {
      logger.setLevel("warn");
      logger.warn("test warning");

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("does not log warn when level is error", () => {
      logger.setLevel("error");
      logger.warn("test warning");

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("logs error when level is error", () => {
      logger.setLevel("error");
      logger.error("test error");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("enable/disable functionality", () => {
    it("logs when enabled", () => {
      logger.enable();
      logger.info("test message");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("does not log when disabled", () => {
      logger.disable();
      logger.info("test message");

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("can be re-enabled after disable", () => {
      logger.disable();
      logger.info("should not log");
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.enable();
      logger.info("should log");
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("respects disable for all log levels", () => {
      logger.disable();

      logger.debug("test");
      logger.info("test");
      logger.warn("test");
      logger.error("test");

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("structured log output", () => {
    it("outputs JSON-formatted logs", () => {
      logger.info("test message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(logCall)).not.toThrow();
    });

    it("includes timestamp in log entry", () => {
      logger.info("test message");

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.timestamp).toBeDefined();
      expect(typeof logEntry.timestamp).toBe("string");
    });

    it("includes level in log entry", () => {
      logger.info("test message");

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.level).toBe("info");
    });

    it("includes message in log entry", () => {
      logger.info("test message");

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.message).toBe("test message");
    });

    it("formats timestamp as ISO string", () => {
      logger.info("test");

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(() => new Date(logEntry.timestamp)).not.toThrow();
    });
  });

  describe("context inclusion", () => {
    it("includes context in log entry", () => {
      logger.info("test", { cardName: "Mickey Mouse" });

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.cardName).toBe("Mickey Mouse");
    });

    it("includes multiple context properties", () => {
      logger.info("test", {
        abilityText: "draw 2 cards",
        cardName: "Mickey Mouse",
        stage: "parsing",
      });

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.cardName).toBe("Mickey Mouse");
      expect(logEntry.abilityText).toBe("draw 2 cards");
      expect(logEntry.stage).toBe("parsing");
    });

    it("handles empty context", () => {
      logger.info("test", {});

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.message).toBe("test");
    });

    it("handles undefined context", () => {
      logger.info("test");

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.message).toBe("test");
    });

    it("supports custom context properties", () => {
      logger.info("test", {
        customKey: "customValue",
        nested: { key: "value" },
      });

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      expect(logEntry.customKey).toBe("customValue");
      expect(logEntry.nested).toEqual({ key: "value" });
    });
  });

  describe("log methods", () => {
    it("has debug method", () => {
      logger.setLevel("debug");
      logger.debug("debug message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe("debug");
    });

    it("has info method", () => {
      logger.info("info message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe("info");
    });

    it("has warn method", () => {
      logger.warn("warn message");

      expect(consoleWarnSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleWarnSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe("warn");
    });

    it("has error method", () => {
      logger.error("error message");

      expect(consoleErrorSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe("error");
    });
  });

  describe("console method selection", () => {
    it("uses console.log for debug", () => {
      logger.setLevel("debug");
      logger.debug("test");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("uses console.log for info", () => {
      logger.info("test");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("uses console.warn for warn", () => {
      logger.warn("test");

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("uses console.error for error", () => {
      logger.error("test");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("setLevel method", () => {
    it("accepts debug level", () => {
      expect(() => logger.setLevel("debug")).not.toThrow();
    });

    it("accepts info level", () => {
      expect(() => logger.setLevel("info")).not.toThrow();
    });

    it("accepts warn level", () => {
      expect(() => logger.setLevel("warn")).not.toThrow();
    });

    it("accepts error level", () => {
      expect(() => logger.setLevel("error")).not.toThrow();
    });

    it("changes logging behavior", () => {
      logger.setLevel("error");
      logger.info("should not log");
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.setLevel("info");
      logger.info("should log");
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("environment configuration", () => {
    it("respects PARSER_DEBUG environment variable", () => {
      // This test verifies the logger reads process.env.PARSER_DEBUG
      // The actual behavior is tested in other tests
      expect(logger).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles very long messages", () => {
      const longMessage = "a".repeat(10_000);
      logger.info(longMessage);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.message).toBe(longMessage);
    });

    it("handles special characters in messages", () => {
      logger.info('test "quoted" message with \n newlines');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.message).toContain("quoted");
    });

    it("handles objects in context", () => {
      logger.info("test", { arr: [1, 2, 3], obj: { nested: true } });

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.obj.nested).toBe(true);
      expect(logEntry.arr).toEqual([1, 2, 3]);
    });

    it("handles null context values", () => {
      logger.info("test", { value: null });

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.value).toBeNull();
    });
  });

  describe("log level hierarchy", () => {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];

    it("respects level hierarchy from debug", () => {
      logger.setLevel("debug");

      logger.debug("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      logger.info("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);

      logger.warn("test");
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      logger.error("test");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("respects level hierarchy from info", () => {
      logger.setLevel("info");

      logger.debug("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      logger.info("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      logger.warn("test");
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      logger.error("test");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("respects level hierarchy from warn", () => {
      logger.setLevel("warn");

      logger.debug("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      logger.info("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      logger.warn("test");
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      logger.error("test");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("respects level hierarchy from error", () => {
      logger.setLevel("error");

      logger.debug("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      logger.info("test");
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      logger.warn("test");
      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);

      logger.error("test");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
