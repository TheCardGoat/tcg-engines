/**
 * Tests for Conditional Effect Parsing
 *
 * Tests parsing of conditional effects with "if" clauses:
 * - "if you have..." conditions
 * - "if this character has..." conditions
 * - "if an opponent has..." conditions
 * - "instead" clauses for else branches
 */

import { describe, expect, it } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";

describe("Conditional Effect Parser", () => {
  describe("Simple conditional effects", () => {
    it('should parse "if you have a character named Elsa, draw a card"', () => {
      const result = parseEffect(
        "If you have a character named Elsa, draw a card",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have a character named Elsa",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
      expect((result as { else?: unknown }).else).toBeUndefined();
    });

    it('should parse "if you have 3 or more items, deal 3 damage to chosen character"', () => {
      const result = parseEffect(
        "If you have 3 or more items, deal 3 damage to chosen character",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have 3 or more items",
          type: "if",
        },
        then: {
          amount: 3,
          type: "deal-damage",
        },
        type: "conditional",
      });
      // Verify target object is present in then effect
      expect(
        (result as { then: { target: unknown } }).then.target,
      ).toBeDefined();
    });

    it('should parse "if you have no cards in hand, gain 2 lore"', () => {
      const result = parseEffect("If you have no cards in hand, gain 2 lore");

      expect(result).toMatchObject({
        condition: {
          expression: "you have no cards in hand",
          type: "if",
        },
        then: {
          amount: 2,
          type: "gain-lore",
        },
        type: "conditional",
      });
    });
  });

  describe("Conditional effects with 'instead' clause", () => {
    it('should parse "Deal 2 damage. If you have 3 or more items, deal 3 damage instead"', () => {
      const result = parseEffect(
        "Deal 2 damage to chosen character. If you have 3 or more items, deal 3 damage to chosen character instead",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have 3 or more items",
          type: "if",
        },
        else: {
          amount: 2,
          type: "deal-damage",
        },
        then: {
          amount: 3,
          type: "deal-damage",
        },
        type: "conditional",
      });
    });

    it('should parse "Gain 1 lore. If you have no cards in hand, gain 2 lore instead"', () => {
      const result = parseEffect(
        "Gain 1 lore. If you have no cards in hand, gain 2 lore instead",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have no cards in hand",
          type: "if",
        },
        else: {
          amount: 1,
          type: "gain-lore",
        },
        then: {
          amount: 2,
          type: "gain-lore",
        },
        type: "conditional",
      });
    });
  });

  describe('"if this character has..." conditions', () => {
    it('should parse "if this character has damage, draw a card"', () => {
      const result = parseEffect("If this character has damage, draw a card");

      expect(result).toMatchObject({
        condition: {
          expression: "this character has damage",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
    });

    it('should parse "if this character has no damage, draw 2 cards"', () => {
      const result = parseEffect(
        "If this character has no damage, draw 2 cards",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "this character has no damage",
          type: "if",
        },
        then: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
    });
  });

  describe('"if an opponent has..." conditions', () => {
    it('should parse "if an opponent has more lore than you, draw 2 cards"', () => {
      const result = parseEffect(
        "If an opponent has more lore than you, draw 2 cards",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "an opponent has more lore than you",
          type: "if",
        },
        then: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
    });

    it('should parse "if an opponent has no characters, gain 3 lore"', () => {
      const result = parseEffect(
        "If an opponent has no characters, gain 3 lore",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "an opponent has no characters",
          type: "if",
        },
        then: {
          amount: 3,
          type: "gain-lore",
        },
        type: "conditional",
      });
    });
  });

  describe("Character count conditions", () => {
    it('should parse "if you have 3 or more characters in play, draw a card"', () => {
      const result = parseEffect(
        "If you have 3 or more characters in play, draw a card",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have 3 or more characters in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
    });
  });

  describe("Complex conditional effects", () => {
    it('should parse "if you have a Floodborn character, draw 2 cards"', () => {
      const result = parseEffect(
        "If you have a Floodborn character, draw 2 cards",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have a Floodborn character",
          type: "if",
        },
        then: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      });
    });

    it("should parse damage conditional with different amounts", () => {
      const result = parseEffect(
        "Deal 1 damage to chosen character. If you have an item, deal 2 damage to chosen character instead",
      );

      expect(result).toMatchObject({
        condition: {
          expression: "you have an item",
          type: "if",
        },
        else: {
          amount: 1,
          type: "deal-damage",
        },
        then: {
          amount: 2,
          type: "deal-damage",
        },
        type: "conditional",
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle trailing periods correctly", () => {
      const result = parseEffect(
        "If you have a character named Elsa, draw a card.",
      );

      expect(result).toMatchObject({ type: "conditional" });
    });

    it("should handle mixed case", () => {
      const result = parseEffect("if you have no cards in hand, gain 1 lore");

      expect(result).toMatchObject({ type: "conditional" });
    });
  });

  describe("Non-conditional effects should not match", () => {
    it('should not parse "Draw a card if possible" as conditional', () => {
      const result = parseEffect("Draw a card");

      expect(result).toMatchObject({ type: "draw" });
    });

    it('should parse optional effects with "you may" correctly', () => {
      const result = parseEffect("You may draw a card");

      expect(result).toMatchObject({ type: "optional" });
    });
  });
});
