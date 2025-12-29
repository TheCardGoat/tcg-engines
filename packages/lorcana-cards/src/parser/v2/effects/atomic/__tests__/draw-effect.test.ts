/**
 * Tests for Draw Effect Parser
 * Ensures draw card effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { drawEffectParser } from "../draw-effect";

describe("drawEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'draw 2 cards' correctly", () => {
      const result = drawEffectParser.parse("draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'draw 1 card' with singular form", () => {
      const result = drawEffectParser.parse("draw 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'draw 3 cards' with larger number", () => {
      const result = drawEffectParser.parse("draw 3 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses 'draw 10 cards' with double-digit number", () => {
      const result = drawEffectParser.parse("draw 10 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(10);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'DRAW 2 CARDS' in uppercase", () => {
      const result = drawEffectParser.parse("DRAW 2 CARDS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'Draw 2 Cards' in mixed case", () => {
      const result = drawEffectParser.parse("Draw 2 Cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'dRaW 2 cArDs' in random case", () => {
      const result = drawEffectParser.parse("dRaW 2 cArDs");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = drawEffectParser.parse("draw 2 cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses with multiple spaces", () => {
      const result = drawEffectParser.parse("draw  2  cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses with tabs", () => {
      const result = drawEffectParser.parse("draw\t2\tcards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });
  });

  describe("text parsing - edge cases", () => {
    it("parses draw 0 cards (edge case)", () => {
      const result = drawEffectParser.parse("draw 0 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("parses large numbers correctly", () => {
      const result = drawEffectParser.parse("draw 99 cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(99);
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for discard text", () => {
      const result = drawEffectParser.parse("discard 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = drawEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing number", () => {
      const result = drawEffectParser.parse("draw cards");

      expect(result).toBeNull();
    });

    it("returns null for missing 'card' keyword", () => {
      const result = drawEffectParser.parse("draw 2");

      expect(result).toBeNull();
    });

    it("returns null for completely unrelated text", () => {
      const result = drawEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = drawEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for random text", () => {
      const result = drawEffectParser.parse("xyz 123 abc");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing", () => {
    it("parses CST node with Number token", () => {
      const cstNode = {
        Number: [{ image: "2" }],
      };

      const result = drawEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses CST node with single card", () => {
      const cstNode = {
        Number: [{ image: "1" }],
      };

      const result = drawEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("returns null when Number token is missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      };

      const result = drawEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Number array is empty", () => {
      const cstNode = {
        Number: [],
      };

      const result = drawEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when number is not parseable", () => {
      const cstNode = {
        Number: [{ image: "abc" }],
      };

      const result = drawEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(drawEffectParser.pattern).toBeDefined();
      expect(drawEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(drawEffectParser.description).toBeDefined();
      expect(typeof drawEffectParser.description).toBe("string");
      expect(drawEffectParser.description.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(drawEffectParser.parse).toBeDefined();
      expect(typeof drawEffectParser.parse).toBe("function");
    });
  });
});
