/**
 * Tests for Discard Effect Parser
 * Ensures discard card effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { discardEffectParser } from "../discard-effect";

describe("discardEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'discard 2 cards' correctly", () => {
      const result = discardEffectParser.parse("discard 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'discard 1 card' with singular form", () => {
      const result = discardEffectParser.parse("discard 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'discard 3 cards' with larger number", () => {
      const result = discardEffectParser.parse("discard 3 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses 'discard 5 cards' with medium number", () => {
      const result = discardEffectParser.parse("discard 5 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(5);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'DISCARD 2 CARDS' in uppercase", () => {
      const result = discardEffectParser.parse("DISCARD 2 CARDS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'Discard 2 Cards' in mixed case", () => {
      const result = discardEffectParser.parse("Discard 2 Cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'DiScArD 1 cArD' in random case", () => {
      const result = discardEffectParser.parse("DiScArD 1 cArD");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = discardEffectParser.parse("discard 2 cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses with multiple spaces", () => {
      const result = discardEffectParser.parse("discard  3  cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses with tabs", () => {
      const result = discardEffectParser.parse("discard\t1\tcard");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });
  });

  describe("text parsing - edge cases", () => {
    it("parses discard 0 cards (edge case)", () => {
      const result = discardEffectParser.parse("discard 0 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("parses large numbers correctly", () => {
      const result = discardEffectParser.parse("discard 50 cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(50);
    });

    it("parses double-digit numbers", () => {
      const result = discardEffectParser.parse("discard 10 cards");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(10);
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = discardEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = discardEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing number", () => {
      const result = discardEffectParser.parse("discard cards");

      expect(result).toBeNull();
    });

    it("returns null for missing 'card' keyword", () => {
      const result = discardEffectParser.parse("discard 2");

      expect(result).toBeNull();
    });

    it("returns null for lore text", () => {
      const result = discardEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = discardEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = discardEffectParser.parse("banish chosen character");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing", () => {
    it("parses CST node with Number token", () => {
      const cstNode = {
        Number: [{ image: "2" }],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses CST node with single card", () => {
      const cstNode = {
        Number: [{ image: "1" }],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses CST node with large number", () => {
      const cstNode = {
        Number: [{ image: "7" }],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(7);
    });

    it("returns null when Number token is missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Number array is empty", () => {
      const cstNode = {
        Number: [],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when number is not parseable", () => {
      const cstNode = {
        Number: [{ image: "xyz" }],
      };

      const result = discardEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(discardEffectParser.pattern).toBeDefined();
      expect(discardEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(discardEffectParser.description).toBeDefined();
      expect(typeof discardEffectParser.description).toBe("string");
      expect(discardEffectParser.description.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(discardEffectParser.parse).toBeDefined();
      expect(typeof discardEffectParser.parse).toBe("function");
    });
  });
});
