/**
 * Tests for For-Each and Repeat Effects Parsing
 *
 * Tests parsing of for-each and repeat effect patterns in Lorcana ability text.
 */

import { describe, expect, it } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";

describe("For-Each Effects", () => {
  describe("For each character", () => {
    it("should parse for each character you have", () => {
      const effect = parseEffect("Gain 1 lore for each character you have");

      expect(effect).toEqual({
        counter: { controller: "you", type: "characters" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each character in play (implicit 'you')", () => {
      const effect = parseEffect(
        "Gain 1 lore for each character you have in play",
      );

      expect(effect).toEqual({
        counter: { controller: "you", type: "characters" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each opponent's character", () => {
      const effect = parseEffect(
        "Deal 1 damage to chosen character for each opponent's character",
      );

      expect(effect).toEqual({
        counter: { controller: "opponent", type: "characters" },
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "for-each",
      });
    });
  });

  describe("For each damaged character", () => {
    it("should parse for each damaged character", () => {
      const effect = parseEffect("Draw a card for each damaged character");

      expect(effect).toEqual({
        counter: { controller: "any", type: "damaged-characters" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });

    it("should parse for each damaged character in play", () => {
      const effect = parseEffect(
        "Gain 2 lore for each damaged character in play",
      );

      expect(effect).toEqual({
        counter: { controller: "any", type: "damaged-characters" },
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });

  describe("For each item", () => {
    it("should parse for each item you have", () => {
      const effect = parseEffect("Draw a card for each item you have");

      expect(effect).toEqual({
        counter: { controller: "you", type: "items" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });

    it("should parse for each opponent's item", () => {
      const effect = parseEffect(
        "Gain 1 lore for each opponent's item in play",
      );

      expect(effect).toEqual({
        counter: { controller: "opponent", type: "items" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });

  describe("For each location", () => {
    it("should parse for each location you have", () => {
      const effect = parseEffect("Gain 2 lore for each location you have");

      expect(effect).toEqual({
        counter: { controller: "you", type: "locations" },
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });

  describe("For each card in hand", () => {
    it("should parse for each card in your hand", () => {
      const effect = parseEffect(
        "Deal 1 damage to chosen character for each card in your hand",
      );

      expect(effect).toEqual({
        counter: { controller: "you", type: "cards-in-hand" },
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "for-each",
      });
    });

    it("should parse for each card in opponent's hand", () => {
      const effect = parseEffect("Gain 1 lore for each card in their hand");

      expect(effect).toEqual({
        counter: { controller: "opponent", type: "cards-in-hand" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });

  describe("For each card in discard", () => {
    it("should parse for each card in your discard", () => {
      const effect = parseEffect("Gain 1 lore for each card in your discard");

      expect(effect).toEqual({
        counter: { controller: "you", type: "cards-in-discard" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each card in discard pile", () => {
      const effect = parseEffect(
        "Draw a card for each card in your discard pile",
      );

      expect(effect).toEqual({
        counter: { controller: "you", type: "cards-in-discard" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });
  });

  describe("For each damage counter", () => {
    it("should parse for each damage on this character", () => {
      const effect = parseEffect(
        "Gain 1 lore for each damage counter on this character",
      );

      expect(effect).toEqual({
        counter: { type: "damage-on-self" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each damage on it", () => {
      const effect = parseEffect("Draw a card for each damage on it");

      expect(effect).toEqual({
        counter: { type: "damage-on-self" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });

    it("should parse for each damage on chosen character", () => {
      const effect = parseEffect(
        "Gain 1 lore for each damage on chosen character",
      );

      expect(effect).toEqual({
        counter: { type: "damage-on-target" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });

  describe("For each card under", () => {
    it("should parse for each card under this character", () => {
      const effect = parseEffect(
        "Gain 2 lore for each card under this character",
      );

      expect(effect).toEqual({
        counter: { type: "cards-under-self" },
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each card under it", () => {
      const effect = parseEffect("Draw a card for each card under it");

      expect(effect).toEqual({
        counter: { type: "cards-under-self" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });
  });

  describe("For each character that sang", () => {
    it("should parse for each character that sang this turn", () => {
      const effect = parseEffect(
        "Gain 1 lore for each character that sang this turn",
      );

      expect(effect).toEqual({
        counter: { thisTurn: true, type: "characters-that-sang" },
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });

    it("should parse for each character that sang (no 'this turn')", () => {
      const effect = parseEffect("Draw a card for each character that sang");

      expect(effect).toEqual({
        counter: { thisTurn: false, type: "characters-that-sang" },
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "for-each",
      });
    });
  });

  describe("Complex for-each effects", () => {
    it("should parse exert effect for each", () => {
      const effect = parseEffect(
        "Exert chosen character for each item you have",
      );

      expect(effect).toEqual({
        counter: { controller: "you", type: "items" },
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "exert",
        },
        type: "for-each",
      });
    });

    it("should parse banish effect for each", () => {
      const effect = parseEffect(
        "Banish chosen character for each damaged character",
      );

      expect(effect).toEqual({
        counter: { controller: "any", type: "damaged-characters" },
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "for-each",
      });
    });
  });
});

describe("Repeat Effects", () => {
  describe("Basic repeat patterns", () => {
    it("should parse repeat this 3 times", () => {
      const effect = parseEffect(
        "Deal 1 damage to chosen character. Repeat this 3 times",
      );

      expect(effect).toEqual({
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        times: 3,
        type: "repeat",
      });
    });

    it("should parse repeat that 2 times", () => {
      const effect = parseEffect("Draw a card. Repeat that 2 times");

      expect(effect).toEqual({
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        times: 2,
        type: "repeat",
      });
    });

    it("should parse repeat this 1 time", () => {
      const effect = parseEffect("Gain 2 lore. Repeat this 1 time");

      expect(effect).toEqual({
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        times: 1,
        type: "repeat",
      });
    });
  });

  describe("Optional repeat patterns", () => {
    it("should parse you may repeat this up to 2 times", () => {
      const effect = parseEffect(
        "Draw a card. You may repeat this up to 2 times",
      );

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          times: 2,
          type: "repeat",
        },
        type: "optional",
      });
    });

    it("should parse repeat this up to 3 times (implicit optional)", () => {
      const effect = parseEffect(
        "Deal 2 damage to chosen character. Repeat this up to 3 times",
      );

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          effect: {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          times: 3,
          type: "repeat",
        },
        type: "optional",
      });
    });
  });

  describe("Complex repeat effects", () => {
    it("should parse exert effect with repeat", () => {
      const effect = parseEffect("Exert chosen character. Repeat this 2 times");

      expect(effect).toEqual({
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "exert",
        },
        times: 2,
        type: "repeat",
      });
    });

    it("should parse ready effect with repeat", () => {
      const effect = parseEffect("Ready chosen character. Repeat that 1 time");

      expect(effect).toEqual({
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "ready",
        },
        times: 1,
        type: "repeat",
      });
    });
  });
});

describe("Integration Tests", () => {
  it("should handle case-insensitive for-each patterns", () => {
    const effect = parseEffect("Gain 1 lore For Each character you have");

    expect(effect).toEqual({
      counter: { controller: "you", type: "characters" },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      type: "for-each",
    });
  });

  it("should handle case-insensitive repeat patterns", () => {
    const effect = parseEffect("Draw a card. Repeat This 2 times");

    expect(effect).toEqual({
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      times: 2,
      type: "repeat",
    });
  });

  it("should not parse invalid for-each patterns", () => {
    const effect = parseEffect("Gain 1 lore for some reason");

    expect(effect).toEqual({
      amount: 1,
      type: "gain-lore",
    });
  });

  it("should not parse repeat without number", () => {
    const effect = parseEffect("Draw a card. Repeat this");

    // Should parse as sequence or just the draw effect
    expect(effect?.type).not.toBe("repeat");
  });
});
