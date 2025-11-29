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
        type: "conditional",
        condition: { type: "has-named-character" },
        then: { type: "draw" },
      });
      expect((result as { else?: unknown }).else).toBeUndefined();
    });

    it('should parse "if you have 3 or more items, deal 3 damage to chosen character"', () => {
      const result = parseEffect(
        "If you have 3 or more items, deal 3 damage to chosen character",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "has-item-count" },
        then: { type: "deal-damage" },
      });
    });

    it('should parse "if you have no cards in hand, gain 2 lore"', () => {
      const result = parseEffect("If you have no cards in hand, gain 2 lore");

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "resource-count" },
        then: { type: "gain-lore" },
      });
    });
  });

  describe("Conditional effects with 'instead' clause", () => {
    it('should parse "Deal 2 damage. If you have 3 or more items, deal 3 damage instead"', () => {
      const result = parseEffect(
        "Deal 2 damage to chosen character. If you have 3 or more items, deal 3 damage to chosen character instead",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "has-item-count" },
        then: { type: "deal-damage" },
        else: { type: "deal-damage" },
      });
    });

    it('should parse "Gain 1 lore. If you have no cards in hand, gain 2 lore instead"', () => {
      const result = parseEffect(
        "Gain 1 lore. If you have no cards in hand, gain 2 lore instead",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "resource-count" },
        then: { type: "gain-lore" },
        else: { type: "gain-lore" },
      });
    });
  });

  describe('"if this character has..." conditions', () => {
    it('should parse "if this character has damage, draw a card"', () => {
      const result = parseEffect("If this character has damage, draw a card");

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "has-any-damage" },
        then: { type: "draw" },
      });
    });

    it('should parse "if this character has no damage, draw 2 cards"', () => {
      const result = parseEffect(
        "If this character has no damage, draw 2 cards",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "no-damage" },
        then: { type: "draw" },
      });
    });
  });

  describe('"if an opponent has..." conditions', () => {
    it('should parse "if an opponent has more lore than you, draw 2 cards"', () => {
      const result = parseEffect(
        "If an opponent has more lore than you, draw 2 cards",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "comparison" },
        then: { type: "draw" },
      });
    });

    it('should parse "if an opponent has no characters, gain 3 lore"', () => {
      const result = parseEffect(
        "If an opponent has no characters, gain 3 lore",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "resource-count" },
        then: { type: "gain-lore" },
      });
    });
  });

  describe("Character count conditions", () => {
    it('should parse "if you have 3 or more characters in play, draw a card"', () => {
      const result = parseEffect(
        "If you have 3 or more characters in play, draw a card",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "resource-count" },
        then: { type: "draw" },
      });
    });
  });

  describe("Complex conditional effects", () => {
    it('should parse "if you have a Floodborn character, draw 2 cards"', () => {
      const result = parseEffect(
        "If you have a Floodborn character, draw 2 cards",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "has-character-with-classification" },
        then: { type: "draw" },
      });
    });

    it("should parse damage conditional with different amounts", () => {
      const result = parseEffect(
        "Deal 1 damage to chosen character. If you have an item, deal 2 damage to chosen character instead",
      );

      expect(result).toMatchObject({
        type: "conditional",
        condition: { type: "has-item-count" },
        then: { type: "deal-damage" },
        else: { type: "deal-damage" },
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
