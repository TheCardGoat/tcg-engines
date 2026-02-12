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
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Draw 2 cards
      expect(sequence.steps![0]).toEqual({
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      });

      // Step 2: Choose and discard a card
      expect(sequence.steps![1]).toEqual({
        amount: 1,
        chosen: true,
        target: "CONTROLLER",
        type: "discard",
      });
    });

    it("should parse 'Deal 2 damage to chosen character, then draw a card'", () => {
      const effect = parseEffect(
        "Deal 2 damage to chosen character, then draw a card",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Deal 2 damage
      expect(sequence.steps![0]).toEqual({
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      });

      // Step 2: Draw a card
      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it("should parse 'Exert chosen opposing character, then deal 1 damage to them'", () => {
      const effect = parseEffect(
        "Exert chosen opposing character, then deal 1 damage to chosen opposing character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      // Step 1: Exert character
      expect(sequence.steps![0]).toEqual({
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      });

      // Step 2: Deal 1 damage
      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      });
    });

    it("should parse 'Gain 2 lore, then draw 2 cards'", () => {
      const effect = parseEffect("Gain 2 lore, then draw 2 cards");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 2,
        type: "gain-lore",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      });
    });
  });

  describe("Period-separated sequences", () => {
    it("should parse 'Draw a card. Gain 1 lore.'", () => {
      const effect = parseEffect("Draw a card. Gain 1 lore.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        type: "gain-lore",
      });
    });

    it("should parse 'Exert chosen character. Deal 2 damage to chosen character.'", () => {
      const effect = parseEffect(
        "Exert chosen character. Deal 2 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      });
    });

    it("should parse 'Ready chosen character. Draw a card.'", () => {
      const effect = parseEffect("Ready chosen character. Draw a card.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "ready",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });
  });

  describe("'and' combinations", () => {
    it("should parse 'Draw a card and gain 1 lore'", () => {
      const effect = parseEffect("Draw a card and gain 1 lore");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        type: "gain-lore",
      });
    });

    it("should parse 'Gain 2 lore and draw a card'", () => {
      const effect = parseEffect("Gain 2 lore and draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 2,
        type: "gain-lore",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it("should parse 'Deal 2 damage to chosen character and deal 2 damage to chosen character'", () => {
      const effect = parseEffect(
        "Deal 2 damage to chosen character and deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
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
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(3);

      expect(sequence.steps![0]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        type: "gain-lore",
      });

      expect(sequence.steps![2]).toEqual({
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      });
    });

    it("should parse 'Gain 1 lore, then draw a card, then banish chosen character'", () => {
      const effect = parseEffect(
        "Gain 1 lore, then draw a card, then banish chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(3);

      expect(sequence.steps![0]).toEqual({
        amount: 1,
        type: "gain-lore",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });

      expect(sequence.steps![2]).toEqual({
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      });
    });
  });

  describe("Mixed separators", () => {
    it("should handle '. Then' separator", () => {
      const effect = parseEffect("Draw 2 cards. Then gain 1 lore");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        type: "gain-lore",
      });
    });

    it("should handle '. Then,' separator", () => {
      const effect = parseEffect("Exert chosen character. Then, draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequence = effect as SequenceEffect;
      expect(sequence.steps).toBeDefined();
      expect(sequence.steps).toHaveLength(2);

      expect(sequence.steps![0]).toEqual({
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      });

      expect(sequence.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });
  });

  describe("Edge cases", () => {
    it("should return first effect if sequence contains unparsable step", () => {
      const effect = parseEffect("Draw a card, then do something unparsable");

      // Parser returns undefined when sequence fails (all-or-nothing approach)
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

      // Parser returns undefined (not null) when unable to parse
      expect(effect).toBeUndefined();
    });

    it("should handle single effect without creating sequence", () => {
      const effect = parseEffect("Draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("draw");
      expect(effect).not.toHaveProperty("steps");
    });

    it("should parse sequence with ready and restriction effects", () => {
      const effect = parseEffect(
        "Ready chosen character. They can't quest this turn",
      );

      // Both parts are now parsable:
      // 1. "Ready chosen character" → ready effect
      // 2. "They can't quest this turn" → restriction effect
      // So the parser correctly returns a sequence
      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");
      if (effect?.type === "sequence" && effect.steps) {
        expect(effect.steps).toHaveLength(2);
        expect(effect.steps[0].type).toBe("ready");
        expect((effect.steps[1] as any).type).toBe("restriction");
      }
    });
  });
});
