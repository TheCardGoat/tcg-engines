/**
 * Tests for CardParser abstract class
 */

import { describe, expect, test } from "bun:test";
import { CardParser } from "./card-parser";
import type { ParserResult } from "./types";

// Test implementation of CardParser
class TestParser extends CardParser<string, number> {
  protected doParse(input: string): ParserResult<number> {
    if (input === "error") {
      return {
        success: false,
        errors: ["Test error"],
      };
    }

    const num = Number.parseInt(input, 10);
    if (Number.isNaN(num)) {
      return {
        success: false,
        errors: ["Invalid number"],
      };
    }

    const warnings: string[] = [];
    if (num < 0) {
      warnings.push("Negative number");
    }

    return {
      success: true,
      data: num,
      warnings,
    };
  }
}

describe("CardParser", () => {
  test("should parse valid input", () => {
    const parser = new TestParser();
    const result = parser.parse("42");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
      expect(result.warnings).toEqual([]);
    }
  });

  test("should handle parsing errors", () => {
    const parser = new TestParser();
    const result = parser.parse("error");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("Test error");
    }
  });

  test("should include warnings", () => {
    const parser = new TestParser();
    const result = parser.parse("-5");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(-5);
      expect(result.warnings).toContain("Negative number");
    }
  });

  test("should parse batch inputs", () => {
    const parser = new TestParser();
    const results = parser.parseBatch(["1", "2", "3"]);

    expect(results).toHaveLength(3);
    expect(results.every((r) => r.success)).toBe(true);
    if (results.every((r) => r.success)) {
      expect(results[0].data).toBe(1);
      expect(results[1].data).toBe(2);
      expect(results[2].data).toBe(3);
    }
  });

  test("should handle mixed results in batch", () => {
    const parser = new TestParser();
    const results = parser.parseBatch(["1", "invalid", "3"]);

    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[2].success).toBe(true);
  });

  test("should validate input before parsing", () => {
    const parser = new TestParser();
    const result = parser.parse("abc");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("Invalid number");
    }
  });
});
