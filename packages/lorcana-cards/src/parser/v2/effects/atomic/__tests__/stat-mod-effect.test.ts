/**
 * Tests for Stat Modification Effect Parser
 * Ensures stat modification effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { CstNode } from "chevrotain";
import type { Effect } from "../../../types";
import { statModEffectParser } from "../stat-mod-effect";

describe("statModEffectParser", () => {
  describe("text parsing - positive modifiers (happy path)", () => {
    it("parses 'gets +2 strength' correctly", () => {
      const result = statModEffectParser.parse("gets +2 strength");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(2);
      expect((result as Effect & { stat: string }).stat).toBe("strength");
    });

    it("parses 'gets +1 willpower' correctly", () => {
      const result = statModEffectParser.parse("gets +1 willpower");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(1);
      expect((result as Effect & { stat: string }).stat).toBe("willpower");
    });

    it("parses 'gets +3 lore' correctly", () => {
      const result = statModEffectParser.parse("gets +3 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(3);
      expect((result as Effect & { stat: string }).stat).toBe("lore");
    });

    it("parses 'get +5 strength' with singular form", () => {
      const result = statModEffectParser.parse("get +5 strength");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(5);
    });
  });

  describe("text parsing - negative modifiers (happy path)", () => {
    it("parses 'gets -2 strength' correctly", () => {
      const result = statModEffectParser.parse("gets -2 strength");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(-2);
      expect((result as Effect & { stat: string }).stat).toBe("strength");
    });

    it("parses 'gets -1 willpower' correctly", () => {
      const result = statModEffectParser.parse("gets -1 willpower");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(-1);
      expect((result as Effect & { stat: string }).stat).toBe("willpower");
    });

    it("parses 'gets -3 lore' correctly", () => {
      const result = statModEffectParser.parse("gets -3 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(-3);
      expect((result as Effect & { stat: string }).stat).toBe("lore");
    });

    it("parses 'get -4 willpower' with singular form", () => {
      const result = statModEffectParser.parse("get -4 willpower");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(-4);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'GETS +2 STRENGTH' in uppercase", () => {
      const result = statModEffectParser.parse("GETS +2 STRENGTH");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(2);
      expect((result as Effect & { stat: string }).stat).toBe("strength");
    });

    it("parses 'Gets +3 Willpower' in mixed case", () => {
      const result = statModEffectParser.parse("Gets +3 Willpower");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(3);
      expect((result as Effect & { stat: string }).stat).toBe("willpower");
    });

    it("parses 'gEtS -1 LoRe' in random case", () => {
      const result = statModEffectParser.parse("gEtS -1 LoRe");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(-1);
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = statModEffectParser.parse("gets +2 strength");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(2);
    });

    it("parses with multiple spaces", () => {
      const result = statModEffectParser.parse("gets  +3  willpower");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(3);
    });

    it("parses with tabs", () => {
      const result = statModEffectParser.parse("gets\t+1\tlore");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(1);
    });
  });

  describe("text parsing - edge cases", () => {
    it("parses +0 modifier (edge case)", () => {
      const result = statModEffectParser.parse("gets +0 strength");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(0);
    });

    it("parses -0 modifier (edge case)", () => {
      const result = statModEffectParser.parse("gets -0 willpower");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(-0);
    });

    it("parses large positive values", () => {
      const result = statModEffectParser.parse("gets +99 strength");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(99);
    });

    it("parses large negative values", () => {
      const result = statModEffectParser.parse("gets -50 willpower");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(-50);
    });

    it("parses double-digit positive modifier", () => {
      const result = statModEffectParser.parse("gets +10 strength");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(10);
    });

    it("parses double-digit negative modifier", () => {
      const result = statModEffectParser.parse("gets -10 lore");

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(-10);
    });
  });

  describe("text parsing - all stat types", () => {
    it("handles strength stat correctly", () => {
      const result = statModEffectParser.parse("gets +2 strength");

      expect((result as Effect & { stat: string }).stat).toBe("strength");
    });

    it("handles willpower stat correctly", () => {
      const result = statModEffectParser.parse("gets +2 willpower");

      expect((result as Effect & { stat: string }).stat).toBe("willpower");
    });

    it("handles lore stat correctly", () => {
      const result = statModEffectParser.parse("gets +2 lore");

      expect((result as Effect & { stat: string }).stat).toBe("lore");
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = statModEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = statModEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing sign", () => {
      const result = statModEffectParser.parse("gets 2 strength");

      expect(result).toBeNull();
    });

    it("returns null for missing number", () => {
      const result = statModEffectParser.parse("gets + strength");

      expect(result).toBeNull();
    });

    it("returns null for missing stat type", () => {
      const result = statModEffectParser.parse("gets +2");

      expect(result).toBeNull();
    });

    it("returns null for invalid stat type", () => {
      const result = statModEffectParser.parse("gets +2 power");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = statModEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = statModEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'has' instead of 'gets'", () => {
      const result = statModEffectParser.parse("has +2 strength");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing", () => {
    it("parses CST node with Number token", () => {
      const cstNode = {
        NumberToken: [{ image: "2" }],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("modify-stat");
      expect((result as Effect & { modifier: number }).modifier).toBe(2);
    });

    it("parses CST node with single modifier", () => {
      const cstNode = {
        NumberToken: [{ image: "1" }],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(1);
    });

    it("parses CST node with large modifier", () => {
      const cstNode = {
        NumberToken: [{ image: "7" }],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { modifier: number }).modifier).toBe(7);
    });

    it("returns null when Number token is missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Number array is empty", () => {
      const cstNode = {
        NumberToken: [],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when number is not parseable", () => {
      const cstNode = {
        NumberToken: [{ image: "abc" }],
      } as unknown as CstNode;

      const result = statModEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(statModEffectParser.pattern).toBeDefined();
      expect(statModEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(statModEffectParser.description).toBeDefined();
      expect(typeof statModEffectParser.description).toBe("string");
      expect(statModEffectParser.description?.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(statModEffectParser.parse).toBeDefined();
      expect(typeof statModEffectParser.parse).toBe("function");
    });
  });
});
