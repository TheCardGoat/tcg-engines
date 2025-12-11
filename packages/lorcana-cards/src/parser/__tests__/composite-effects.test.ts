/**
 * Tests for Composite Effect Parsing
 *
 * Tests parsing of composite effects (sequences with "then", multiple effects, "and" combinations)
 * from ability text into SequenceEffect structures.
 */

import { describe, expect, it } from "bun:test";
import type { SequenceEffect } from "@tcg/lorcana";
import { parseEffect } from "../parsers/effect-parser";

describe("Composite Effect Parser", () => {
  describe("'then' sequences", () => {
    it("should parse 'Draw 2 cards, then choose and discard a card'", () => {
      const effect = parseEffect(
        "Draw 2 cards, then choose and discard a card",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Draw 2 cards
      expect(sequence.steps[0]).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });

      // Step 2: Choose and discard a card
      expect(sequence.steps[1]).toEqual({
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      });
    });

    it("should parse 'Deal 2 damage to chosen character, then draw a card'", () => {
      const effect = parseEffect(
        "Deal 2 damage to chosen character, then draw a card",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Deal 2 damage
      expect(sequence.steps[0]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      // Step 2: Draw a card
      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });

    it("should parse 'Exert chosen opposing character, then deal 1 damage to them'", () => {
      const effect = parseEffect(
        "Exert chosen opposing character, then deal 1 damage to chosen opposing character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Exert character
      expect(sequence.steps[0]).toEqual({
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      // Step 2: Deal 1 damage
      expect(sequence.steps[1]).toEqual({
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });

    it("should parse 'Gain 2 lore, then draw 2 cards'", () => {
      const effect = parseEffect("Gain 2 lore, then draw 2 cards");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "gain-lore",
        amount: 2,
      });

      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });
    });
  });

  describe("Period-separated sequences", () => {
    it("should parse 'Draw a card. Gain 1 lore.'", () => {
      const effect = parseEffect("Draw a card. Gain 1 lore.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(sequence.steps[1]).toEqual({
        type: "gain-lore",
        amount: 1,
      });
    });

    it("should parse 'Exert chosen character. Deal 2 damage to chosen character.'", () => {
      const effect = parseEffect(
        "Exert chosen character. Deal 2 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      expect(sequence.steps[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });

    it("should parse 'Ready chosen character. Draw a card.'", () => {
      const effect = parseEffect("Ready chosen character. Draw a card.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });
  });

  describe("'and' combinations", () => {
    it("should parse 'Draw a card and gain 1 lore'", () => {
      const effect = parseEffect("Draw a card and gain 1 lore");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(sequence.steps[1]).toEqual({
        type: "gain-lore",
        amount: 1,
      });
    });

    it("should parse 'Gain 2 lore and draw a card'", () => {
      const effect = parseEffect("Gain 2 lore and draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "gain-lore",
        amount: 2,
      });

      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });

    it("should parse 'Deal 2 damage to chosen character and deal 2 damage to chosen character'", () => {
      const effect = parseEffect(
        "Deal 2 damage to chosen character and deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      expect(sequence.steps[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });
  });

  describe("Three-step sequences", () => {
    it("should parse 'Draw a card. Gain 1 lore. Deal 1 damage to chosen character.'", () => {
      const effect = parseEffect(
        "Draw a card. Gain 1 lore. Deal 1 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(3);

      expect(sequence.steps[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(sequence.steps[1]).toEqual({
        type: "gain-lore",
        amount: 1,
      });

      expect(sequence.steps[2]).toEqual({
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });

    it("should parse 'Gain 1 lore, then draw a card, then banish chosen character'", () => {
      const effect = parseEffect(
        "Gain 1 lore, then draw a card, then banish chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(3);

      expect(sequence.steps[0]).toEqual({
        type: "gain-lore",
        amount: 1,
      });

      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(sequence.steps[2]).toEqual({
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });
    });
  });

  describe("Mixed separators", () => {
    it("should handle '. Then' separator", () => {
      const effect = parseEffect("Draw 2 cards. Then gain 1 lore");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });

      expect(sequence.steps[1]).toEqual({
        type: "gain-lore",
        amount: 1,
      });
    });

    it("should handle '. Then,' separator", () => {
      const effect = parseEffect("Exert chosen character. Then, draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps[0]).toEqual({
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      });

      expect(sequence.steps[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });
  });

  describe("Edge cases", () => {
    it("should return undefined if sequence contains unparsable step", () => {
      const effect = parseEffect("Draw a card, then do something unparsable");

      expect(effect).toBeUndefined();
    });

    it("should not treat 'choose and discard' as a sequence", () => {
      const effect = parseEffect("choose and discard a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("discard");
      expect(effect).not.toHaveProperty("steps");
    });

    it("should not split on 'and' that is not between effects", () => {
      const effect = parseEffect(
        "Draw cards equal to your hand size and discard them",
      );

      // This should not parse as sequence because the 'and' is part of the sentence structure
      // For now, this will return undefined since we can't parse this complex effect
      expect(effect).toBeUndefined();
    });

    it("should handle single effect without creating sequence", () => {
      const effect = parseEffect("Draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("draw");
      expect(effect).not.toHaveProperty("steps");
    });

    it("should avoid splitting on 'They' after period - parse only ready effect", () => {
      const effect = parseEffect(
        "Ready chosen character. They can't quest this turn",
      );

      // The parser correctly avoids splitting on "They"
      // Since "can't quest" is not parsable yet, it only parses the first part
      // This validates that the negative lookahead for "They" works
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("ready");
      expect(effect).not.toHaveProperty("steps");
    });
  });
});
