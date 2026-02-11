/**
 * Tests for {d} placeholder handling in effects
 *
 * Tests parsing of effects that use the {d} placeholder for numeric values.
 * The {d} placeholder is converted to -1 as a sentinel value.
 *
 * TODO: {d} placeholder parsing is not fully implemented yet.
 * This entire suite is skipped until the feature is implemented.
 */

import { describe, expect, it } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";

describe.skip("{d} Placeholder Effects", () => {
  describe("Gain Lore with {d}", () => {
    it("should parse 'Gain {d} lore'", () => {
      const effect = parseEffect("Gain {d} lore");

      expect(effect).toEqual({
        amount: -1,
        type: "gain-lore", // {d} placeholder converted to -1
      });
    });

    it("should parse 'gain {d} lore' (lowercase)", () => {
      const effect = parseEffect("gain {d} lore");

      expect(effect).toEqual({
        amount: -1,
        type: "gain-lore",
      });
    });
  });

  describe("Deal Damage with {d}", () => {
    it("should parse 'Deal {d} damage to chosen character'", () => {
      const effect = parseEffect("Deal {d} damage to chosen character");

      expect(effect).toEqual({
        type: "deal-damage",
        amount: -1, // {d} placeholder converted to -1
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      });
    });

    it("should parse 'deal {d} damage' (lowercase)", () => {
      const effect = parseEffect(
        "deal {d} damage to chosen opposing character",
      );

      expect(effect).toEqual({
        amount: -1,
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
  });

  describe("Draw Cards with {d}", () => {
    it("should parse 'Draw {d} cards'", () => {
      const effect = parseEffect("Draw {d} cards");

      expect(effect).toEqual({
        type: "draw",
        amount: -1, // {d} placeholder converted to -1
        target: "CONTROLLER",
      });
    });

    it("should parse 'draw {d} cards' (lowercase)", () => {
      const effect = parseEffect("draw {d} cards");

      expect(effect).toEqual({
        amount: -1,
        target: "CONTROLLER",
        type: "draw",
      });
    });
  });

  describe("Remove Damage with {d}", () => {
    it("should parse 'Remove {d} damage from chosen character'", () => {
      const effect = parseEffect("Remove {d} damage from chosen character");

      expect(effect).toEqual({
        type: "remove-damage",
        amount: -1, // {d} placeholder converted to -1
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        upTo: false,
      });
    });

    it("should parse 'Remove up to {d} damage from chosen character'", () => {
      const effect = parseEffect(
        "Remove up to {d} damage from chosen character",
      );

      expect(effect).toEqual({
        amount: -1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      });
    });
  });

  describe("Lose Lore with {d}", () => {
    it("should parse 'Each opponent loses {d} lore'", () => {
      const effect = parseEffect("Each opponent loses {d} lore");

      expect(effect).toEqual({
        type: "lose-lore",
        amount: -1, // {d} placeholder converted to -1
        target: "EACH_OPPONENT", // Target parser correctly identifies "Each opponent"
      });
    });

    it("should parse 'lose {d} lore' (opponent)", () => {
      const effect = parseEffect("loses {d} lore");

      expect(effect).toEqual({
        amount: -1,
        target: "OPPONENT",
        type: "lose-lore",
      });
    });
  });

  describe("Stat Modifier with {d}", () => {
    it("should parse 'Chosen character gets +{d} {S} this turn'", () => {
      const effect = parseEffect("Chosen character gets +{d} {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: -1, // +{d} placeholder converted to -1
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        duration: "this-turn",
      });
    });

    it("should parse 'gets {d} {S} this turn' (without +)", () => {
      const effect = parseEffect("gets {d} {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: -1, // {d} without sign defaults to positive, converted to -1
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'gets -{d} {S} this turn' (negative modifier)", () => {
      const effect = parseEffect("gets -{d} {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: 1, // -{d} stored as positive 1, will be negated at runtime
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'gets +{d} {W} this turn' (willpower)", () => {
      const effect = parseEffect("Chosen character gets +{d} {W} this turn");

      expect(effect).toEqual({
        duration: "this-turn",
        modifier: -1,
        stat: "willpower",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      });
    });

    it("should parse 'gets +{d} {L} this turn' (lore)", () => {
      const effect = parseEffect("gets +{d} {L} this turn");

      expect(effect).toEqual({
        duration: "this-turn",
        modifier: -1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      });
    });
  });

  describe("Put Damage with {d}", () => {
    it("should parse 'Put {d} damage counters on chosen character'", () => {
      const effect = parseEffect("Put {d} damage counters on chosen character");

      expect(effect).toEqual({
        type: "put-damage",
        amount: -1, // {d} placeholder converted to -1
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      });
    });

    it("should parse 'Put {d} damage counter' (singular)", () => {
      const effect = parseEffect("Put {d} damage counter on chosen character");

      expect(effect).toEqual({
        amount: -1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "put-damage",
      });
    });
  });

  describe("Mixed: Numeric and {d} Placeholders", () => {
    it("should parse numeric values correctly", () => {
      const effect = parseEffect("Gain 3 lore");

      expect(effect).toEqual({
        amount: 3,
        type: "gain-lore", // Numeric value stays as-is
      });
    });

    it("should parse {d} placeholder correctly", () => {
      const effect = parseEffect("Gain {d} lore");

      expect(effect).toEqual({
        amount: -1,
        type: "gain-lore", // {d} converted to -1
      });
    });

    it("should handle both in sequence (sequence not implemented yet)", () => {
      const effect1 = parseEffect("Gain 2 lore");
      const effect2 = parseEffect("Gain {d} lore");

      expect(effect1).toEqual({
        amount: 2,
        type: "gain-lore",
      });

      expect(effect2).toEqual({
        amount: -1,
        type: "gain-lore",
      });
    });
  });

  describe("Complex Effects with {d}", () => {
    it("should parse optional effect with {d}", () => {
      const effect = parseEffect("you may deal {d} damage to chosen character");

      expect(effect).toEqual({
        chooser: "CONTROLLER",
        effect: {
          amount: -1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      });
    });

    it("should parse for-each effect with {d} in base effect", () => {
      const effect = parseEffect("Gain {d} lore for each character you have");

      expect(effect).toEqual({
        counter: {
          controller: "you",
          type: "characters",
        },
        effect: {
          amount: -1,
          type: "gain-lore",
        },
        type: "for-each",
      });
    });
  });
});
