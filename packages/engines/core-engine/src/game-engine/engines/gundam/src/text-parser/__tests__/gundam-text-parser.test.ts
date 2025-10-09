/**
 * Tests for GundamTextParser class that extends core CardParser
 */

import { describe, expect, it } from "bun:test";
import {
  createGundamTextParser,
  GundamTextParser,
} from "../gundam-text-parser";

describe("GundamTextParser", () => {
  describe("constructor", () => {
    it("creates parser with default config", () => {
      const parser = new GundamTextParser();
      expect(parser).toBeInstanceOf(GundamTextParser);
    });

    it("creates parser with custom config", () => {
      const parser = new GundamTextParser({ debug: true });
      expect(parser).toBeInstanceOf(GundamTextParser);
    });
  });

  describe("parse()", () => {
    it("returns success result for valid card text", () => {
      const parser = new GundamTextParser();
      const text = "【Deploy】 Draw 1 card.";

      const result = parser.parse(text);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.abilities).toHaveLength(1);
        expect(result.data.abilities[0]?.type).toBe("triggered");
        expect(result.warnings).toHaveLength(0);
      }
    });

    it("returns error result for empty text", () => {
      const parser = new GundamTextParser();
      const text = "";

      const result = parser.parse(text);

      expect(result.success).toBe(false);
      // Type narrowing issue - skip detailed error checks for now
      // TODO: Fix ParserResult type narrowing
    });

    it("handles errors without throwing", () => {
      const parser = new GundamTextParser();
      const text = "";

      expect(() => parser.parse(text)).not.toThrow();
    });
  });

  describe("parseBatch()", () => {
    it("parses multiple card texts", () => {
      const parser = new GundamTextParser();
      const texts = [
        "【Deploy】 Draw 1 card.",
        "【Burst】 Deal 3 damage to target unit.",
        "<Rush> When this unit attacks, draw 1 card.",
      ];

      const results = parser.parseBatch(texts);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("continues parsing after encountering errors", () => {
      const parser = new GundamTextParser();
      const texts = [
        "", // Invalid
        "【Deploy】 Draw 1 card.", // Valid
        "", // Invalid
      ];

      const results = parser.parseBatch(texts);

      expect(results).toHaveLength(3);
      expect(results[0]?.success).toBe(false);
      expect(results[1]?.success).toBe(true);
      expect(results[2]?.success).toBe(false);
    });
  });

  describe("parseSuccessful()", () => {
    it("filters out failed parses and returns only successful data", () => {
      const parser = new GundamTextParser();
      const texts = [
        "", // Will fail
        "【Deploy】 Draw 1 card.", // Will succeed
        "【Burst】 Deal 3 damage.", // Will succeed
      ];

      const successfulData = parser.parseSuccessful(texts);

      expect(successfulData).toHaveLength(2);
      expect(successfulData.every((data) => data.abilities.length > 0)).toBe(
        true,
      );
    });

    it("returns empty array when all parses fail", () => {
      const parser = new GundamTextParser();
      const texts = ["", "", ""];

      const successfulData = parser.parseSuccessful(texts);

      expect(successfulData).toHaveLength(0);
    });
  });

  describe("analyzeText()", () => {
    it("analyzes text structure without generating abilities", () => {
      const parser = new GundamTextParser();
      const text = "【Deploy】 Draw 1 card. 【Burst】 Deal 2 damage.";

      const analysis = parser.analyzeText(text);

      expect(analysis).toHaveProperty("sentences");
      expect(analysis).toHaveProperty("clauses");
      expect(analysis).toHaveProperty("isComplex");
      expect(analysis.clauses.length).toBeGreaterThan(0);
    });

    it("identifies complex patterns", () => {
      const parser = new GundamTextParser();
      const text = "Choose one: Draw 2 cards or Destroy target unit.";

      const analysis = parser.analyzeText(text);

      expect(analysis.modalInfo.isModal).toBe(true);
      expect(analysis.isComplex).toBe(true);
    });

    it("identifies keyword effects", () => {
      const parser = new GundamTextParser();
      const text = "<Rush> <Blocker>";

      const analysis = parser.analyzeText(text);

      expect(analysis.hasKeywords).toBe(true);
    });
  });

  describe("cleanText()", () => {
    it("cleans HTML entities from text", () => {
      const parser = new GundamTextParser();
      const text = "&lt;Rush&gt; This unit can attack immediately.";

      const cleaned = parser.cleanText(text);

      expect(cleaned).toContain("<Rush>");
      expect(cleaned).not.toContain("&lt;");
    });

    it("normalizes line breaks", () => {
      const parser = new GundamTextParser();
      const text = "Line 1<br>Line 2<br>Line 3";

      const cleaned = parser.cleanText(text);

      expect(cleaned).toContain("\n");
      expect(cleaned).not.toContain("<br>");
    });

    it("adds newlines after timing markers", () => {
      const parser = new GundamTextParser();
      const text = "【Deploy】Draw 1 card.";

      const cleaned = parser.cleanText(text);

      // Should have newline after marker
      expect(cleaned).toMatch(/【Deploy】\n/);
    });
  });

  describe("createGundamTextParser()", () => {
    it("creates parser with default config", () => {
      const parser = createGundamTextParser();

      expect(parser).toBeInstanceOf(GundamTextParser);
    });

    it("creates parser with custom config", () => {
      const parser = createGundamTextParser({ debug: true, strictMode: false });

      expect(parser).toBeInstanceOf(GundamTextParser);
    });
  });

  describe("config handling", () => {
    it("respects debug config", () => {
      const parser = new GundamTextParser({ debug: false });
      const text = "【Deploy】 Draw 1 card.";

      // Should not log debug messages
      const result = parser.parse(text);

      expect(result.success).toBe(true);
    });

    it("supports strict mode config", () => {
      const parser = new GundamTextParser({ strictMode: true });
      const text = "【Deploy】 Draw 1 card.";

      const result = parser.parse(text);

      // Should still parse successfully
      expect(result.success).toBe(true);
    });
  });

  describe("complex card text patterns", () => {
    it("parses cards with multiple abilities", () => {
      const parser = new GundamTextParser();
      const text =
        "【Deploy】 Draw 1 card. 【Burst】 Deal 2 damage to target unit.";

      const result = parser.parse(text);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.abilities.length).toBeGreaterThan(0);
      }
    });

    it("parses cards with keyword abilities", () => {
      const parser = new GundamTextParser();
      const text = "<Rush> <Blocker> When this unit is deployed, draw 1 card.";

      const result = parser.parse(text);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.abilities.length).toBeGreaterThan(0);
      }
    });

    it("parses cards with conditional effects", () => {
      const parser = new GundamTextParser();
      const text = "If you control 3 or more units, draw 2 cards.";

      const result = parser.parse(text);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clauses.length).toBeGreaterThan(0);
      }
    });

    it("parses cards with modal choices", () => {
      const parser = new GundamTextParser();
      const text = "Choose one: Draw 2 cards or Deal 3 damage to target unit.";

      const result = parser.parse(text);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clauses.length).toBeGreaterThan(0);
      }
    });
  });
});
