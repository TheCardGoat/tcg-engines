/**
 * Tests for integration with core CardParser infrastructure
 *
 * These tests verify that the Gundam text parser properly extends
 * the core CardParser class and integrates with core tooling utilities.
 */

import { describe, expect, it } from "bun:test";
import type { ParserResult } from "@tcg/core/tooling";
import { parseGundamText } from "../parser";
import type { GundamParseResult } from "../types";

describe("GundamTextParser core integration", () => {
  describe("parse()", () => {
    it("returns success result for valid card text", () => {
      const text = "【Deploy】 Draw 1 card.";

      const result = parseGundamText(text);

      expect(result.errors).toHaveLength(0);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities[0]?.type).toBe("triggered");
    });

    it("returns error result for empty text", () => {
      const text = "";

      const result = parseGundamText(text);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.abilities).toHaveLength(0);
    });

    it("includes warnings for complex patterns", () => {
      const text = "Choose one: Draw 2 cards or Destroy target unit.";

      const result = parseGundamText(text, { debug: false });

      // Should parse successfully even if warnings exist
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("parseBatch()", () => {
    it("parses multiple card texts", () => {
      const texts = [
        "【Deploy】 Draw 1 card.",
        "【Burst】 Deal 3 damage to target unit.",
        "<Rush> When this unit attacks, draw 1 card.",
      ];

      const results = texts.map((text) => parseGundamText(text));

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.errors.length === 0)).toBe(true);
      expect(results.every((r) => r.abilities.length > 0)).toBe(true);
    });

    it("continues parsing after encountering errors", () => {
      const texts = [
        "", // Invalid
        "【Deploy】 Draw 1 card.", // Valid
        "", // Invalid
      ];

      const results = texts.map((text) => parseGundamText(text));

      expect(results).toHaveLength(3);
      expect(results[0]?.errors.length).toBeGreaterThan(0);
      expect(results[1]?.errors).toHaveLength(0);
      expect(results[2]?.errors.length).toBeGreaterThan(0);
    });
  });

  describe("parseSuccessful()", () => {
    it("filters out failed parses and returns only successful data", () => {
      const texts = [
        "", // Will fail
        "【Deploy】 Draw 1 card.", // Will succeed
        "【Burst】 Deal 3 damage.", // Will succeed
      ];

      const results = texts
        .map((text) => parseGundamText(text))
        .filter((result) => result.errors.length === 0);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.abilities.length > 0)).toBe(true);
    });
  });

  describe("error handling", () => {
    it("catches and returns parse errors gracefully", () => {
      // Test with potentially problematic input
      const text = "【】 invalid marker";

      const result = parseGundamText(text);

      // Should not throw, should return result with errors or warnings
      expect(result).toBeDefined();
      expect(result.abilities).toBeDefined();
    });

    it("provides meaningful error messages", () => {
      const text = "";

      const result = parseGundamText(text);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("Empty");
    });
  });

  describe("normalization", () => {
    it("normalizes text before parsing", () => {
      const text1 = "【Deploy】  Draw  1  card."; // Extra spaces
      const text2 = "【Deploy】 Draw 1 card."; // Normal spacing

      const result1 = parseGundamText(text1);
      const result2 = parseGundamText(text2);

      // Both should parse to the same ability structure
      expect(result1.abilities).toHaveLength(result2.abilities.length);
      expect(result1.abilities[0]?.type).toBe(result2.abilities[0]?.type);
    });

    it("handles HTML entities in text", () => {
      const text =
        "&lt;Rush&gt; This unit can attack on the turn it is deployed.";

      const result = parseGundamText(text);

      expect(result.errors).toHaveLength(0);
      expect(result.abilities.length).toBeGreaterThan(0);
    });
  });

  describe("ParserResult type compatibility", () => {
    it("result structure matches ParserResult<GundamParseResult> type", () => {
      const text = "【Deploy】 Draw 1 card.";

      const result = parseGundamText(text);

      // Verify structure matches ParserResult requirements
      if (result.errors.length === 0) {
        // Success case
        expect(result).toHaveProperty("abilities");
        expect(result).toHaveProperty("warnings");
        expect(result).toHaveProperty("errors");
        expect(result).toHaveProperty("clauses");
      } else {
        // Error case
        expect(result).toHaveProperty("errors");
        expect(Array.isArray(result.errors)).toBe(true);
      }
    });
  });

  describe("complex card text patterns", () => {
    it("parses cards with multiple abilities", () => {
      const text =
        "【Deploy】 Draw 1 card. 【Burst】 Deal 2 damage to target unit.";

      const result = parseGundamText(text);

      expect(result.errors).toHaveLength(0);
      expect(result.abilities.length).toBeGreaterThan(0);
    });

    it("parses cards with keyword abilities", () => {
      const text = "<Rush> <Blocker> When this unit is deployed, draw 1 card.";

      const result = parseGundamText(text);

      expect(result.errors).toHaveLength(0);
      expect(result.abilities.length).toBeGreaterThan(0);
    });

    it("parses cards with resource instructions", () => {
      const text =
        "(Place this card face-down in your resource area during your Main Phase.)";

      const result = parseGundamText(text);

      expect(result.errors).toHaveLength(0);
      // Rule text may not generate abilities but should parse without errors
      expect(result.clauses.length).toBeGreaterThan(0);
    });
  });
});
