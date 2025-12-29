/**
 * Tests for Effect Parser Registry
 * Ensures the registry correctly iterates through parsers and returns first match.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import {
  atomicEffectParsers,
  type EffectParser,
  parseAtomicEffect,
} from "../index";

describe("Effect Parser Registry", () => {
  describe("atomicEffectParsers array", () => {
    it("is an array", () => {
      expect(Array.isArray(atomicEffectParsers)).toBe(true);
    });

    it("contains effect parsers", () => {
      expect(atomicEffectParsers.length).toBeGreaterThan(0);
    });

    it("all parsers have required interface properties", () => {
      for (const parser of atomicEffectParsers) {
        expect(parser.pattern).toBeDefined();
        expect(parser.parse).toBeDefined();
        expect(typeof parser.parse).toBe("function");
      }
    });

    it("all parsers have descriptions", () => {
      for (const parser of atomicEffectParsers) {
        expect(parser.description).toBeDefined();
        expect(typeof parser.description).toBe("string");
        expect(parser.description.length).toBeGreaterThan(0);
      }
    });

    it("contains exactly 8 parsers", () => {
      // Verify all expected parsers are registered
      expect(atomicEffectParsers.length).toBe(8);
    });
  });

  describe("parser registration order", () => {
    it("has statModEffectParser first (most specific)", () => {
      expect(atomicEffectParsers[0].description).toContain("stat");
    });

    it("has keywordEffectParser second", () => {
      expect(atomicEffectParsers[1].description).toContain("keyword");
    });

    it("has damageEffectParser third", () => {
      expect(atomicEffectParsers[2].description).toContain("damage");
    });

    it("has loreEffectParser fourth", () => {
      expect(atomicEffectParsers[3].description).toContain("lore");
    });

    it("has exertEffectParser fifth", () => {
      expect(atomicEffectParsers[4].description).toContain("exert");
    });

    it("has banishEffectParser sixth", () => {
      expect(atomicEffectParsers[5].description).toContain("banish");
    });

    it("has drawEffectParser seventh", () => {
      expect(atomicEffectParsers[6].description).toContain("draw");
    });

    it("has discardEffectParser eighth", () => {
      expect(atomicEffectParsers[7].description).toContain("discard");
    });
  });

  describe("parseAtomicEffect function", () => {
    it("is a function", () => {
      expect(typeof parseAtomicEffect).toBe("function");
    });

    it("accepts string input", () => {
      const result = parseAtomicEffect("draw 2 cards");
      expect(result).not.toBeNull();
    });

    it("accepts CST node input", () => {
      const cstNode = {
        Number: [{ image: "2" }],
      };
      const result = parseAtomicEffect(cstNode);
      // Should try all parsers, at least one might match
      expect(result).toBeDefined();
    });
  });

  describe("first matching parser wins", () => {
    it("returns draw effect for draw text", () => {
      const result = parseAtomicEffect("draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("returns discard effect for discard text", () => {
      const result = parseAtomicEffect("discard 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("returns damage effect for damage text", () => {
      const result = parseAtomicEffect("deal 3 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("returns lore effect for gain lore text", () => {
      const result = parseAtomicEffect("gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("returns lore effect with negative amount for lose lore text", () => {
      const result = parseAtomicEffect("lose 1 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(-1);
    });

    it("returns exert effect for exert text", () => {
      const result = parseAtomicEffect("exert chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("returns ready effect for ready text", () => {
      const result = parseAtomicEffect("ready this character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("returns banish effect for banish text", () => {
      const result = parseAtomicEffect("banish chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("returns return effect for return text", () => {
      const result = parseAtomicEffect("return this character to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return");
    });

    it("returns stat modification effect for stat mod text", () => {
      const result = parseAtomicEffect("gets +2 strength");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("statModification");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("returns keyword effect for keyword text", () => {
      const result = parseAtomicEffect("gains Evasive");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });
  });

  describe("returns null when no parser matches", () => {
    it("returns null for completely unrelated text", () => {
      const result = parseAtomicEffect("random text that doesn't match");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = parseAtomicEffect("");

      expect(result).toBeNull();
    });

    it("returns null for partial match", () => {
      const result = parseAtomicEffect("draw cards");

      expect(result).toBeNull();
    });

    it("returns null for unknown effect type", () => {
      const result = parseAtomicEffect("destroy chosen character");

      expect(result).toBeNull();
    });

    it("returns null for malformed effect", () => {
      const result = parseAtomicEffect("deal damage 2");

      expect(result).toBeNull();
    });

    it("returns null for numbers only", () => {
      const result = parseAtomicEffect("123 456");

      expect(result).toBeNull();
    });

    it("returns null for keywords only", () => {
      const result = parseAtomicEffect("draw discard damage");

      expect(result).toBeNull();
    });
  });

  describe("parser iteration order", () => {
    it("stops at first match", () => {
      // Create a mock input that could match multiple parsers
      // Since stat mod is first and most specific, it should win
      const result = parseAtomicEffect("gets +2 lore");

      expect(result).not.toBeNull();
      // Should match statModification, not lore
      expect(result?.type).toBe("statModification");
    });

    it("tries all parsers if none match", () => {
      const result = parseAtomicEffect("unrecognized effect text");

      // All parsers tried, none matched
      expect(result).toBeNull();
    });
  });

  describe("case insensitivity across registry", () => {
    it("handles uppercase text", () => {
      const result = parseAtomicEffect("DRAW 2 CARDS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
    });

    it("handles mixed case text", () => {
      const result = parseAtomicEffect("Discard 1 Card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("discard");
    });

    it("handles lowercase text", () => {
      const result = parseAtomicEffect("deal 2 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
    });
  });

  describe("complex text parsing", () => {
    it("extracts effect from longer ability text", () => {
      const result = parseAtomicEffect(
        "When you play this character, draw 2 cards",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("handles effect with target clause", () => {
      const result = parseAtomicEffect("deal 3 damage to chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("handles effect with condition", () => {
      const result = parseAtomicEffect(
        "if you have another character, gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("lore");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });
  });

  describe("parser interface compliance", () => {
    it("all parsers implement EffectParser interface", () => {
      for (const parser of atomicEffectParsers) {
        // Check pattern property
        expect(parser.pattern).toBeDefined();
        expect(
          parser.pattern instanceof RegExp ||
            typeof parser.pattern === "string",
        ).toBe(true);

        // Check parse method
        expect(parser.parse).toBeDefined();
        expect(typeof parser.parse).toBe("function");

        // Check description property (optional but should be present)
        if (parser.description !== undefined) {
          expect(typeof parser.description).toBe("string");
        }
      }
    });

    it("all parsers return null or Effect object", () => {
      const testInputs = [
        "draw 2 cards",
        "invalid text",
        "",
        "gain 1 lore",
        "random string",
      ];

      for (const parser of atomicEffectParsers) {
        for (const input of testInputs) {
          const result = parser.parse(input);
          expect(result === null || typeof result === "object").toBe(true);
          if (result !== null) {
            expect(result.type).toBeDefined();
            expect(typeof result.type).toBe("string");
          }
        }
      }
    });
  });
});
