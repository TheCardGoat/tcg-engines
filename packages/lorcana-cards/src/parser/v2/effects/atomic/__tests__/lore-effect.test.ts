/**
 * Tests for Lore Effect Parser
 * Ensures lore gain/loss effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { loreEffectParser } from "../lore-effect";

describe("loreEffectParser", () => {
  describe("text parsing - gain lore (happy path)", () => {
    it("parses 'gain 2 lore' correctly", () => {
      const result = loreEffectParser.parse("gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'gain 1 lore' with single point", () => {
      const result = loreEffectParser.parse("gain 1 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'gain 3 lore' with larger number", () => {
      const result = loreEffectParser.parse("gain 3 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses 'gain 5 lore' with medium number", () => {
      const result = loreEffectParser.parse("gain 5 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(5);
    });
  });

  describe("text parsing - lose lore (happy path)", () => {
    it("parses 'lose 2 lore' correctly as negative", () => {
      const result = loreEffectParser.parse("lose 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-2);
    });

    it("parses 'lose 1 lore' with single point", () => {
      const result = loreEffectParser.parse("lose 1 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-1);
    });

    it("parses 'lose 3 lore' with larger number", () => {
      const result = loreEffectParser.parse("lose 3 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-3);
    });

    it("parses 'lose 4 lore' with medium number", () => {
      const result = loreEffectParser.parse("lose 4 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-4);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'GAIN 2 LORE' in uppercase", () => {
      const result = loreEffectParser.parse("GAIN 2 LORE");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'LOSE 2 LORE' in uppercase", () => {
      const result = loreEffectParser.parse("LOSE 2 LORE");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-2);
    });

    it("parses 'Gain 3 Lore' in mixed case", () => {
      const result = loreEffectParser.parse("Gain 3 Lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses 'LoSe 1 LoRe' in random case", () => {
      const result = loreEffectParser.parse("LoSe 1 LoRe");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(-1);
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses gain with single spaces", () => {
      const result = loreEffectParser.parse("gain 2 lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses lose with multiple spaces", () => {
      const result = loreEffectParser.parse("lose  3  lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(-3);
    });

    it("parses gain with tabs", () => {
      const result = loreEffectParser.parse("gain\t1\tlore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });
  });

  describe("text parsing - edge cases", () => {
    it("parses gain 0 lore (edge case)", () => {
      const result = loreEffectParser.parse("gain 0 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("parses lose 0 lore (edge case)", () => {
      const result = loreEffectParser.parse("lose 0 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-0);
    });

    it("parses large gain values", () => {
      const result = loreEffectParser.parse("gain 20 lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(20);
    });

    it("parses large lose values as negative", () => {
      const result = loreEffectParser.parse("lose 15 lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(-15);
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = loreEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = loreEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing number", () => {
      const result = loreEffectParser.parse("gain lore");

      expect(result).toBeNull();
    });

    it("returns null for missing 'lore' keyword", () => {
      const result = loreEffectParser.parse("gain 2");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = loreEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = loreEffectParser.parse("banish chosen character");

      expect(result).toBeNull();
    });

    it("returns null for 'has lore' (not gain/lose)", () => {
      const result = loreEffectParser.parse("has 2 lore");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing - gain", () => {
    it("parses CST node with Gain and Number tokens", () => {
      const cstNode = {
        Gain: [{ image: "gain" }],
        Number: [{ image: "2" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses CST node with single lore gain", () => {
      const cstNode = {
        Gain: [{ image: "gain" }],
        Number: [{ image: "1" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });
  });

  describe("CST parsing - lose", () => {
    it("parses CST node with Lose and Number tokens", () => {
      const cstNode = {
        Lose: [{ image: "lose" }],
        Number: [{ image: "2" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-2);
    });

    it("parses CST node with single lore loss", () => {
      const cstNode = {
        Lose: [{ image: "lose" }],
        Number: [{ image: "3" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(-3);
    });
  });

  describe("CST parsing - error cases", () => {
    it("returns null when Number token is missing", () => {
      const cstNode = {
        Gain: [{ image: "gain" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when both Gain and Lose are missing", () => {
      const cstNode = {
        Number: [{ image: "2" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Number array is empty", () => {
      const cstNode = {
        Gain: [{ image: "gain" }],
        Number: [],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when number is not parseable", () => {
      const cstNode = {
        Gain: [{ image: "gain" }],
        Number: [{ image: "xyz" }],
      };

      const result = loreEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(loreEffectParser.pattern).toBeDefined();
      expect(loreEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(loreEffectParser.description).toBeDefined();
      expect(typeof loreEffectParser.description).toBe("string");
      expect(loreEffectParser.description.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(loreEffectParser.parse).toBeDefined();
      expect(typeof loreEffectParser.parse).toBe("function");
    });
  });
});
