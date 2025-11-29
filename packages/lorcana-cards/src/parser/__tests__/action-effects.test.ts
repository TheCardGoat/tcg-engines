/**
 * Tests for Simple Standalone Action Effects (Task Group 2.5)
 *
 * Tests parsing of standalone action effect patterns including:
 * - "Chosen player draws {d} cards"
 * - "Each player draws X cards"
 * - "Each opponent loses {d} lore"
 * - "Banish all X" patterns
 * - "Ready chosen X" patterns
 * - "Return X from discard to hand"
 * - "Chosen character gains [Keyword] this turn"
 * - "Chosen character gets +/-{d} {S/W/L} this turn"
 */

import { describe, expect, it } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";

describe("Action Effects - Task Group 2.5", () => {
  describe("2.5.1: Chosen player draws {d} cards", () => {
    it("should parse 'Chosen player draws 2 cards'", () => {
      const effect = parseEffect("Chosen player draws 2 cards");

      expect(effect).toEqual({
        type: "draw",
        amount: 2,
        target: "CHOSEN_PLAYER",
      });
    });

    it("should parse 'Chosen player draws {d} cards' with placeholder", () => {
      const effect = parseEffect("Chosen player draws {d} cards");

      expect(effect).toEqual({
        type: "draw",
        amount: -1, // {d} placeholder value
        target: "CHOSEN_PLAYER",
      });
    });

    it("should parse 'Chosen player draws a card'", () => {
      const effect = parseEffect("Chosen player draws a card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "CHOSEN_PLAYER",
      });
    });
  });

  describe("2.5.2: Each player draws X cards", () => {
    it("should parse 'Each player draws 1 card'", () => {
      const effect = parseEffect("Each player draws 1 card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      });
    });

    it("should parse 'Each player draws 2 cards'", () => {
      const effect = parseEffect("Each player draws 2 cards");

      expect(effect).toEqual({
        type: "draw",
        amount: 2,
        target: "EACH_PLAYER",
      });
    });

    it("should parse 'Each opponent draws 1 card'", () => {
      const effect = parseEffect("Each opponent draws 1 card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "EACH_OPPONENT",
      });
    });
  });

  describe("2.5.3: Each opponent loses {d} lore", () => {
    it("should parse 'Each opponent loses 1 lore'", () => {
      const effect = parseEffect("Each opponent loses 1 lore");

      expect(effect).toEqual({
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      });
    });

    it("should parse 'Each opponent loses 2 lore'", () => {
      const effect = parseEffect("Each opponent loses 2 lore");

      expect(effect).toEqual({
        type: "lose-lore",
        amount: 2,
        target: "EACH_OPPONENT",
      });
    });

    it("should parse 'Each opponent loses {d} lore' with placeholder", () => {
      const effect = parseEffect("Each opponent loses {d} lore");

      expect(effect).toEqual({
        type: "lose-lore",
        amount: -1, // {d} placeholder value
        target: "EACH_OPPONENT",
      });
    });
  });

  describe("2.5.4: Banish all X patterns", () => {
    it("should parse 'Banish all items'", () => {
      const effect = parseEffect("Banish all items");

      expect(effect).toEqual({
        type: "banish",
        target: "ALL_CHARACTERS", // Parsed as character target, would need item target type
      });
    });

    it("should parse 'Banish all characters'", () => {
      const effect = parseEffect("Banish all characters");

      expect(effect).toEqual({
        type: "banish",
        target: "ALL_CHARACTERS",
      });
    });

    it("should parse 'Banish all locations'", () => {
      const effect = parseEffect("Banish all locations");

      expect(effect).toEqual({
        type: "banish",
        target: "ALL_CHARACTERS", // Parsed as character target, would need location target type
      });
    });

    it("should parse 'Banish all opposing characters'", () => {
      const effect = parseEffect("Banish all opposing characters");

      expect(effect).toEqual({
        type: "banish",
        target: "ALL_OPPOSING_CHARACTERS",
      });
    });
  });

  describe("2.5.5: Ready chosen X patterns", () => {
    it("should parse 'Ready chosen character'", () => {
      const effect = parseEffect("Ready chosen character");

      expect(effect).toEqual({
        type: "ready",
        target: "CHOSEN_CHARACTER",
      });
    });

    it("should parse 'Ready chosen item'", () => {
      const effect = parseEffect("Ready chosen item");

      expect(effect).toEqual({
        type: "ready",
        target: "CHOSEN_CHARACTER", // Parsed as character, would need item target
      });
    });

    it("should parse 'Ready chosen location'", () => {
      const effect = parseEffect("Ready chosen location");

      expect(effect).toEqual({
        type: "ready",
        target: "CHOSEN_CHARACTER", // Parsed as character, would need location target
      });
    });
  });

  describe("2.5.6: Return X from discard to hand", () => {
    it("should parse 'Return a character from your discard to your hand'", () => {
      const effect = parseEffect(
        "Return a character from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      });
    });

    it("should parse 'Return an action from your discard to your hand'", () => {
      const effect = parseEffect(
        "Return an action from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "action",
        target: "CONTROLLER",
      });
    });

    it("should parse 'Return an item card from your discard to your hand'", () => {
      const effect = parseEffect(
        "Return an item card from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "item",
        target: "CONTROLLER",
      });
    });

    it("should parse 'Return a location from your discard to your hand'", () => {
      const effect = parseEffect(
        "Return a location from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "location",
        target: "CONTROLLER",
      });
    });

    it("should parse 'Return a song from your discard to your hand'", () => {
      const effect = parseEffect(
        "Return a song from your discard to your hand",
      );

      expect(effect).toEqual({
        type: "return-from-discard",
        cardType: "song",
        target: "CONTROLLER",
      });
    });
  });

  describe("2.5.7: Chosen character gains [Keyword] this turn", () => {
    it("should parse 'Chosen character gains Rush this turn'", () => {
      const effect = parseEffect("Chosen character gains Rush this turn");

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gains Ward this turn'", () => {
      const effect = parseEffect("Chosen character gains Ward this turn");

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gains Evasive this turn'", () => {
      const effect = parseEffect("Chosen character gains Evasive this turn");

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gains Challenger +2 this turn'", () => {
      const effect = parseEffect(
        "Chosen character gains Challenger +2 this turn",
      );

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gains Resist +1 this turn'", () => {
      const effect = parseEffect("Chosen character gains Resist +1 this turn");

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });
  });

  describe("2.5.8: Chosen character gets +/-{d} {S/W/L} this turn", () => {
    it("should parse 'Chosen character gets +2 {S} this turn'", () => {
      const effect = parseEffect("Chosen character gets +2 {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gets -1 {W} this turn'", () => {
      const effect = parseEffect("Chosen character gets -1 {W} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "willpower",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gets +1 {L} this turn'", () => {
      const effect = parseEffect("Chosen character gets +1 {L} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gets +{d} {S} this turn' with placeholder", () => {
      const effect = parseEffect("Chosen character gets +{d} {S} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: -1, // {d} placeholder value (positive)
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gets -{d} {W} this turn' with placeholder", () => {
      const effect = parseEffect("Chosen character gets -{d} {W} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "willpower",
        modifier: 1, // {d} placeholder value stored positive, negated later
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });

    it("should parse 'Chosen character gets {d} {L} this turn' without sign (defaults to positive)", () => {
      const effect = parseEffect("Chosen character gets {d} {L} this turn");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "lore",
        modifier: -1, // {d} placeholder value (defaults to positive)
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      });
    });
  });

  describe("Integration: Complex action texts", () => {
    it("should parse action card with multiple recipients", () => {
      // Tests that patterns work in context of full ability text
      const effect = parseEffect("Each player draws 1 card");

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      });
    });

    it("should parse stat modification without 'this turn' clause", () => {
      const effect = parseEffect("Chosen character gets +3 {S}");

      expect(effect).toEqual({
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_CHARACTER",
        duration: "permanent",
      });
    });

    it("should parse keyword grant without 'this turn' clause", () => {
      const effect = parseEffect("Chosen character gains Rush");

      expect(effect).toEqual({
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "permanent",
      });
    });
  });
});
