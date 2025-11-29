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
import type {
  ConditionalEffect,
  Effect,
} from "../../cards/abilities/types/effect-types";
import { parseEffect } from "../parsers/effect-parser";

describe("Conditional Effect Parser", () => {
  describe("Simple conditional effects", () => {
    it('should parse "if you have a character named Elsa, draw a card"', () => {
      const text = "If you have a character named Elsa, draw a card";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("has-named-character");
      expect(conditional.then.type).toBe("draw");
      expect(conditional.else).toBeUndefined();
    });

    it('should parse "if you have 3 or more items, deal 3 damage to chosen character"', () => {
      const text =
        "If you have 3 or more items, deal 3 damage to chosen character";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("has-item-count");
      expect(conditional.then.type).toBe("deal-damage");
    });

    it('should parse "if you have no cards in hand, gain 2 lore"', () => {
      const text = "If you have no cards in hand, gain 2 lore";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("resource-count");
      expect(conditional.then.type).toBe("gain-lore");
    });
  });

  describe("Conditional effects with 'instead' clause", () => {
    it('should parse "Deal 2 damage. If you have 3 or more items, deal 3 damage instead"', () => {
      const text =
        "Deal 2 damage to chosen character. If you have 3 or more items, deal 3 damage to chosen character instead";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("has-item-count");
      expect(conditional.then.type).toBe("deal-damage");
      expect(conditional.else?.type).toBe("deal-damage");
    });

    it('should parse "Gain 1 lore. If you have no cards in hand, gain 2 lore instead"', () => {
      const text =
        "Gain 1 lore. If you have no cards in hand, gain 2 lore instead";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("resource-count");
      expect(conditional.then.type).toBe("gain-lore");
      expect(conditional.else?.type).toBe("gain-lore");
    });
  });

  describe('"if this character has..." conditions', () => {
    it('should parse "if this character has damage, draw a card"', () => {
      const text = "If this character has damage, draw a card";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("has-any-damage");
      expect(conditional.then.type).toBe("draw");
    });

    it('should parse "if this character has no damage, draw 2 cards"', () => {
      const text = "If this character has no damage, draw 2 cards";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("no-damage");
      expect(conditional.then.type).toBe("draw");
    });
  });

  describe('"if an opponent has..." conditions', () => {
    it('should parse "if an opponent has more lore than you, draw 2 cards"', () => {
      const text = "If an opponent has more lore than you, draw 2 cards";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("comparison");
      expect(conditional.then.type).toBe("draw");
    });

    it('should parse "if an opponent has no characters, gain 3 lore"', () => {
      const text = "If an opponent has no characters, gain 3 lore";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("resource-count");
      expect(conditional.then.type).toBe("gain-lore");
    });
  });

  describe("Character count conditions", () => {
    it('should parse "if you have 3 or more characters in play, draw a card"', () => {
      const text = "If you have 3 or more characters in play, draw a card";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("resource-count");
      expect(conditional.then.type).toBe("draw");
    });
  });

  describe("Complex conditional effects", () => {
    it('should parse "if you have a Floodborn character, draw 2 cards"', () => {
      const text = "If you have a Floodborn character, draw 2 cards";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe(
        "has-character-with-classification",
      );
      expect(conditional.then.type).toBe("draw");
    });

    it("should parse damage conditional with different amounts", () => {
      const text =
        "Deal 1 damage to chosen character. If you have an item, deal 2 damage to chosen character instead";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");

      const conditional = result as ConditionalEffect;
      expect(conditional.condition.type).toBe("has-item-count");
      expect(conditional.then.type).toBe("deal-damage");
      expect(conditional.else?.type).toBe("deal-damage");
    });
  });

  describe("Edge cases", () => {
    it("should handle trailing periods correctly", () => {
      const text = "If you have a character named Elsa, draw a card.";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");
    });

    it("should handle mixed case", () => {
      const text = "if you have no cards in hand, gain 1 lore";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("conditional");
    });
  });

  describe("Non-conditional effects should not match", () => {
    it('should not parse "Draw a card if possible" as conditional', () => {
      const text = "Draw a card";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("draw");
    });

    it('should parse optional effects with "you may" correctly', () => {
      const text = "You may draw a card";
      const result = parseEffect(text);

      expect(result).toBeDefined();
      expect(result?.type).toBe("optional");
    });
  });
});
