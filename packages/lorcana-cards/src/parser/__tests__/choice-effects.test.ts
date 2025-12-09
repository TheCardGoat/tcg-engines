/**
 * Tests for Choice Effect Parsing
 *
 * Tests parsing of choice effects from ability text into ChoiceEffect structures.
 * Covers different choice formats:
 * - "Choose one:" with period separators
 * - "Choose one:" with bullet separators
 * - "or" format for simple choices
 */

import { describe, expect, it } from "bun:test";
import type { ChoiceEffect } from "@tcg/lorcana";
import { parseEffect } from "../parsers/effect-parser";

describe("Choice Effect Parser", () => {
  describe("'Choose one:' with period separators", () => {
    it("should parse 'Choose one: Draw a card. Deal 2 damage to chosen character.'", () => {
      const effect = parseEffect(
        "Choose one: Draw a card. Deal 2 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(choice.options[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.optionLabels).toEqual([
        "Draw a card",
        "Deal 2 damage to chosen character",
      ]);
    });

    it("should parse 'Choose one: Gain 2 lore. Draw 2 cards. Deal 3 damage to chosen opposing character.'", () => {
      const effect = parseEffect(
        "Choose one: Gain 2 lore. Draw 2 cards. Deal 3 damage to chosen opposing character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(3);

      expect(choice.options[0]).toEqual({
        type: "gain-lore",
        amount: 2,
      });

      expect(choice.options[1]).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });

      expect(choice.options[2]).toEqual({
        type: "deal-damage",
        amount: 3,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "opponent",
          zone: ["play"],
        },
      });

      expect(choice.optionLabels).toEqual([
        "Gain 2 lore",
        "Draw 2 cards",
        "Deal 3 damage to chosen opposing character",
      ]);
    });

    it("should parse 'Choose one: Exert chosen character. Ready chosen character.'", () => {
      const effect = parseEffect(
        "Choose one: Exert chosen character. Ready chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "exert",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.options[1]).toEqual({
        type: "ready",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });
    });

    it("should parse 'Choose one: Banish chosen character. Return chosen character to their player's hand.'", () => {
      const effect = parseEffect(
        "Choose one: Banish chosen character. Return chosen character to their player's hand.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "banish",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.options[1]).toEqual({
        type: "return-to-hand",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });
    });
  });

  describe("'Choose one:' with bullet separators", () => {
    it("should parse 'Choose one: • Draw a card • Deal 2 damage to chosen character'", () => {
      const effect = parseEffect(
        "Choose one: • Draw a card • Deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(choice.options[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.optionLabels).toEqual([
        "Draw a card",
        "Deal 2 damage to chosen character",
      ]);
    });

    it("should parse 'Choose one: • Gain 2 lore • Draw 2 cards • Banish chosen character'", () => {
      const effect = parseEffect(
        "Choose one: • Gain 2 lore • Draw 2 cards • Banish chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(3);

      expect(choice.options[0]).toEqual({
        type: "gain-lore",
        amount: 2,
      });

      expect(choice.options[1]).toEqual({
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      });

      expect(choice.options[2]).toEqual({
        type: "banish",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.optionLabels).toEqual([
        "Gain 2 lore",
        "Draw 2 cards",
        "Banish chosen character",
      ]);
    });
  });

  describe("'or' format", () => {
    it("should parse 'Draw a card or deal 2 damage to chosen character'", () => {
      const effect = parseEffect(
        "Draw a card or deal 2 damage to chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });

      expect(choice.options[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.optionLabels).toEqual([
        "Draw a card",
        "deal 2 damage to chosen character",
      ]);
    });

    it("should parse 'Gain 1 lore or draw a card'", () => {
      const effect = parseEffect("Gain 1 lore or draw a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "gain-lore",
        amount: 1,
      });

      expect(choice.options[1]).toEqual({
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      });
    });

    it("should parse 'Exert chosen character or ready chosen character'", () => {
      const effect = parseEffect(
        "Exert chosen character or ready chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "exert",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.options[1]).toEqual({
        type: "ready",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });
    });

    it("should parse 'Deal 3 damage to chosen character or banish chosen character'", () => {
      const effect = parseEffect(
        "Deal 3 damage to chosen character or banish chosen character",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "deal-damage",
        amount: 3,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });

      expect(choice.options[1]).toEqual({
        type: "banish",
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });
    });
  });

  describe("Edge cases", () => {
    it("should not parse 'choose and discard' as a choice effect", () => {
      const effect = parseEffect("choose and discard a card");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("discard");
      expect(effect).not.toHaveProperty("options");
    });

    it("should return undefined if a choice option is unparsable", () => {
      const effect = parseEffect(
        "Choose one: Draw a card. Do something unparsable.",
      );

      expect(effect).toBeUndefined();
    });

    it("should not parse 'or more' as a choice separator", () => {
      const effect = parseEffect("If you have 3 or more characters");

      expect(effect).toBeUndefined();
    });

    it("should not parse 'or less' as a choice separator", () => {
      const effect = parseEffect("If cost is 3 or less");

      expect(effect).toBeUndefined();
    });

    it("should handle choice with no valid separators", () => {
      const effect = parseEffect("Choose one: Draw a card");

      // Single option should not create a choice effect
      expect(effect).toBeUndefined();
    });

    it("should prioritize choice effects over sequence effects", () => {
      const effect = parseEffect("Choose one: Draw a card. Gain 1 lore.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");
      expect(effect?.type).not.toBe("sequence");
    });

    it("should handle mixed case 'choose one'", () => {
      const effect = parseEffect(
        "choose one: Draw a card. Deal 2 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");
    });
  });

  describe("Complex choice options", () => {
    it("should parse choice with lore and damage effects", () => {
      const effect = parseEffect(
        "Choose one: Gain 3 lore. Deal 4 damage to chosen opposing character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "gain-lore",
        amount: 3,
      });

      expect(choice.options[1]).toEqual({
        type: "deal-damage",
        amount: 4,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "opponent",
          zone: ["play"],
        },
      });
    });

    it("should parse choice with multiple draw/discard options", () => {
      const effect = parseEffect("Choose one: Draw 3 cards. Discard 2 cards.");

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      });

      expect(choice.options[1]).toEqual({
        type: "discard",
        amount: 2,
        target: "CONTROLLER",
        chosen: false,
      });
    });

    it("should parse choice with remove damage option", () => {
      const effect = parseEffect(
        "Choose one: Remove up to 3 damage from chosen character. Deal 2 damage to chosen character.",
      );

      expect(effect).toBeDefined();
      expect(effect?.type).toBe("choice");

      const choice = effect as ChoiceEffect;
      expect(choice.options).toHaveLength(2);

      expect(choice.options[0]).toEqual({
        type: "remove-damage",
        amount: 3,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
        upTo: true,
      });

      expect(choice.options[1]).toEqual({
        type: "deal-damage",
        amount: 2,
        target: {
          type: "query",
          cardType: "character",
          count: 1,
          controller: "any",
          zone: ["play"],
        },
      });
    });
  });
});
