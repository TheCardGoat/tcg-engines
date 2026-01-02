/**
 * Tests for For-Each Effect Parser
 * Ensures for-each effects like "for each X, Y" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { forEachEffectParser } from "../for-each-effect";

describe("forEachEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'for each character you control, gain 1 lore' correctly", () => {
      const result = forEachEffectParser.parse(
        "for each character you control, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(counter.type).toBe("characters");
      expect(effect.type).toBe("gain-lore");
    });

    it("parses 'for each character, draw 1 card' correctly", () => {
      const result = forEachEffectParser.parse(
        "for each character, draw 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(counter.type).toBe("characters");
      expect(effect.type).toBe("draw");
    });

    it("parses 'for each card in your hand, gain 1 lore' correctly", () => {
      const result = forEachEffectParser.parse(
        "for each card in your hand, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(counter.type).toBe("cards-in-hand");
      expect(effect.type).toBe("gain-lore");
    });

    it("parses 'for each damage counter, draw 1 card' correctly", () => {
      const result = forEachEffectParser.parse(
        "for each damage counter, draw 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(counter.type).toBe("damage-on-target");
      expect(effect.type).toBe("draw");
    });

    it("parses 'for each item you have in play, gain 2 lore' correctly", () => {
      const result = forEachEffectParser.parse(
        "for each item you have in play, gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(counter.type).toBe("items");
      expect(effect.type).toBe("gain-lore");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'FOR EACH' in uppercase", () => {
      const result = forEachEffectParser.parse(
        "FOR EACH character, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("gain-lore");
    });

    it("parses 'FoR eAcH' in mixed case", () => {
      const result = forEachEffectParser.parse(
        "FoR eAcH character, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
    });

    it("parses 'For Each' with capital letters", () => {
      const result = forEachEffectParser.parse(
        "For Each character, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for text without 'for each' pattern", () => {
      const result = forEachEffectParser.parse("gain 1 lore per character");

      expect(result).toBeNull();
    });

    it("returns null for 'for each' without comma", () => {
      const result = forEachEffectParser.parse(
        "for each character gain 1 lore",
      );

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = forEachEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for 'for each' without iterator", () => {
      const result = forEachEffectParser.parse("for each, gain 1 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'for each' without effect", () => {
      const result = forEachEffectParser.parse("for each character,");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - unparseable effects", () => {
    it("returns null when the effect cannot be parsed", () => {
      const result = forEachEffectParser.parse(
        "for each character, do something invalid",
      );

      expect(result).toBeNull();
    });

    it("returns null when effect part is empty", () => {
      const result = forEachEffectParser.parse("for each character, ");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("handles extra whitespace around comma", () => {
      const result = forEachEffectParser.parse(
        "for each character   ,   gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("gain-lore");
    });

    it("handles leading and trailing whitespace", () => {
      const result = forEachEffectParser.parse(
        "  for each character, gain 1 lore  ",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
    });

    it("handles multiple spaces in iterator", () => {
      const result = forEachEffectParser.parse(
        "for each   character   you   control, gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
      const counter = (result as Effect & { counter: { type: string } })
        .counter;
      expect(counter.type).toBe("characters");
    });
  });

  describe("text parsing - different effects", () => {
    it("parses for-each with draw effect", () => {
      const result = forEachEffectParser.parse(
        "for each character you control, draw 1 card",
      );

      expect(result).not.toBeNull();
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("draw");
    });

    it("parses for-each with discard effect", () => {
      const result = forEachEffectParser.parse(
        "for each character, discard 1 card",
      );

      expect(result).not.toBeNull();
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("discard");
    });

    it("parses for-each with damage effect", () => {
      const result = forEachEffectParser.parse(
        "for each character, deal 1 damage to chosen character",
      );

      expect(result).not.toBeNull();
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("deal-damage");
    });
  });

  describe("text parsing - counter variations", () => {
    it("parses simple character counter", () => {
      const result = forEachEffectParser.parse(
        "for each character, gain 1 lore",
      );

      const counter = (
        result as Effect & { counter: { type: string; controller?: string } }
      ).counter;
      expect(counter.type).toBe("characters");
      expect(counter.controller).toBe("any");
    });

    it("parses character counter with controller", () => {
      const result = forEachEffectParser.parse(
        "for each other character you control, gain 1 lore",
      );

      const counter = (
        result as Effect & { counter: { type: string; controller?: string } }
      ).counter;
      expect(counter.type).toBe("characters");
      expect(counter.controller).toBe("you");
    });

    it("parses cards in discard counter", () => {
      const result = forEachEffectParser.parse(
        "for each card in your discard, gain 1 lore",
      );

      const counter = (
        result as Effect & { counter: { type: string; controller?: string } }
      ).counter;
      expect(counter.type).toBe("cards-in-discard");
      expect(counter.controller).toBe("you");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { name: "test", children: {} } as any;
      const result = forEachEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(forEachEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(forEachEffectParser.description).toBeDefined();
      expect(typeof forEachEffectParser.description).toBe("string");
    });
  });
});
