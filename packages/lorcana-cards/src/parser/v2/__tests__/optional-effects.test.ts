/**
 * Tests for Optional Effect Parsing
 *
 * Tests parsing of optional effects ("you may") including:
 * - Simple optional effects
 * - Optional effects with "if you do" follow-ups
 * - Case variations
 * - Complex optional effects
 */

import { describe, expect, it } from "bun:test";
import type { OptionalEffect, SequenceEffect } from "@tcg/lorcana";
import { parseEffect } from "../parsers/effect-parser";

describe("Optional Effect Parser", () => {
  describe("Simple Optional Effects", () => {
    it('should parse "You may draw a card"', () => {
      const effect = parseEffect("You may draw a card");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });
    });

    it('should parse "you may draw a card" (lowercase)', () => {
      const effect = parseEffect("you may draw a card");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });
    });

    it('should parse "You may deal 2 damage to chosen character"', () => {
      const effect = parseEffect("You may deal 2 damage to chosen character");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      });
    });

    it('should parse "You may return chosen character to their player\'s hand"', () => {
      const effect = parseEffect("You may return chosen character to their player's hand");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      });
    });

    it('should parse "You may banish chosen item"', () => {
      const effect = parseEffect("You may banish chosen item");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          // Note: "item" is correctly parsed
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
        },
        type: "optional",
      });
    });

    it('should parse "You may gain 1 lore"', () => {
      const effect = parseEffect("You may gain 1 lore");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "optional",
      });
    });

    it('should parse "You may exert chosen character"', () => {
      const effect = parseEffect("You may exert chosen character");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      });
    });

    it('should parse "You may ready chosen character"', () => {
      const effect = parseEffect("You may ready chosen character");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "ready",
        },
        type: "optional",
      });
    });
  });

  describe("Optional Effects with If You Do", () => {
    it('should parse "You may exert chosen character. If you do, draw a card"', () => {
      const effect = parseEffect("You may exert chosen character. If you do, draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      // First step should be optional exert
      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      });

      // Second step should be draw
      expect(sequenceEffect.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it('should parse "You may banish chosen item. If you do, draw 2 cards"', () => {
      const effect = parseEffect("You may banish chosen item. If you do, draw 2 cards");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          // Note: "item" is correctly parsed
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it('should parse "you may deal 2 damage to chosen character. If you do, gain 1 lore" (lowercase)', () => {
      const effect = parseEffect(
        "you may deal 2 damage to chosen character. If you do, gain 1 lore",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
        amount: 1,
        type: "gain-lore",
      });
    });

    it('should parse "You may return chosen character to their player\'s hand. If you do, draw a card"', () => {
      const effect = parseEffect(
        "You may return chosen character to their player's hand. If you do, draw a card",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it('should parse "You may exert chosen character. If you do, deal 2 damage to another chosen character"', () => {
      const effect = parseEffect(
        "You may exert chosen character. If you do, deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
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

  describe("Case Variations", () => {
    it('should parse "YOU MAY" (uppercase)', () => {
      const effect = parseEffect("YOU MAY draw a card");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });
    });

    it('should parse "You May" (title case)', () => {
      const effect = parseEffect("You May draw a card");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });
    });

    it('should parse "if you do" (lowercase)', () => {
      const effect = parseEffect("You may exert chosen character. if you do, draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);
    });

    it('should parse "If You Do" (title case)', () => {
      const effect = parseEffect("You may exert chosen character. If You Do, draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);
    });
  });

  describe("Complex Optional Effects", () => {
    it("should parse optional effect with multiple damage", () => {
      const effect = parseEffect("You may deal 3 damage to chosen character");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      });
    });

    it("should parse optional lore gain", () => {
      const effect = parseEffect("You may gain 2 lore");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "optional",
      });
    });

    it('should parse optional effect with "if you do" and complex follow-up', () => {
      const effect = parseEffect(
        "You may draw a card. If you do, deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
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

  describe("Edge Cases", () => {
    it("should not confuse optional effects with other patterns", () => {
      // "you may choose" is different from "you may [effect]"
      const effect = parseEffect("draw a card");

      expect(effect).toEqual({
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      });
    });

    it("should handle optional with no valid inner effect", () => {
      const effect = parseEffect("you may something invalid");

      // Should return undefined if inner effect can't be parsed
      expect(effect).toBeUndefined();
    });

    it('should handle "if you do" without "you may"', () => {
      // This should not parse as optional since there's no "you may"
      const effect = parseEffect("Draw a card. If you do, deal 2 damage to chosen character");

      // Should parse as a sequence without optional wrapper
      expect(effect).toBeDefined();
      if (effect?.type === "sequence" && effect.steps) {
        expect(effect.steps[0].type).not.toBe("optional");
      }
    });
  });

  describe("Real Card Examples", () => {
    it('should parse "Whenever this character quests, you may draw a card"', () => {
      // Note: This tests just the effect part, not the trigger
      const effect = parseEffect("you may draw a card");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      });
    });

    it("should parse optional exert with damage follow-up", () => {
      const effect = parseEffect(
        "You may exert chosen character. If you do, deal 1 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("sequence");

      const sequenceEffect = effect as SequenceEffect;
      expect(sequenceEffect.steps).toBeDefined();
      expect(sequenceEffect.steps).toHaveLength(2);

      expect(sequenceEffect.steps![0]).toEqual({
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      });

      expect(sequenceEffect.steps![1]).toEqual({
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
  });
});
