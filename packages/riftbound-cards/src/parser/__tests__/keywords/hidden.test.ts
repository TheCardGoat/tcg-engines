/**
 * Parser tests for Hidden keyword
 *
 * Tests for parsing [Hidden] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Triggers } from "../helpers";

describe("Keyword: Hidden", () => {
  describe("simple hidden", () => {
    it.skip("should parse '[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.hidden()),
      );
    });
  });

  describe("hidden with action spells", () => {
    it.skip("should parse '[Hidden][Action] Deal 2 to a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Deal 2 to a unit at a battlefield. If it's attacking, deal 4 to it instead.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.hidden()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
        }),
      );
    });

    it.skip("should parse '[Hidden][Action] Kill a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Kill a unit at a battlefield. Its controller draws 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Hidden][Action] Kill any number of units at a battlefield with total Might 4 or less.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Kill any number of units at a battlefield with total Might 4 or less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Hidden][Action] Move a unit from a battlefield to its base.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Move a unit from a battlefield to its base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Hidden][Action] Play a ready 3 :rb_might: Sprite unit token with [Temporary].'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Play a ready 3 :rb_might: Sprite unit token with [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
          effect: expect.objectContaining({
            type: "create-token",
          }),
        }),
      );
    });

    it.skip("should parse '[Hidden][Action] Buff a friendly unit.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Buff a friendly unit. Buffs give an additional +1 :rb_might: to friendly units this turn. (To buff a unit, give it a +1 :rb_might: buff if it doesn't already have one.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("hidden with reaction", () => {
    it.skip("should parse '[Hidden][Reaction] Draw 2.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Reaction] (Play any time, even before spells and abilities resolve.)Draw 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.hidden()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "draw",
            amount: 2,
          }),
        }),
      );
    });
  });

  describe("hidden with triggered abilities", () => {
    it.skip("should parse '[Hidden] When you play me, give a unit -2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)When you play me, give a unit -2 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "play-self",
          }),
        }),
      );
    });

    it.skip("should parse '[Hidden] When you play me, give me +3 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)When you play me, give me +3 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Hidden] When I defend or I'm played from [Hidden], reveal the top 5 cards...'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)When I defend or I'm played from [Hidden], reveal the top 5 cards of your Main Deck. Deal 1 to an enemy unit here for each card with [Hidden], then recycle them.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("hidden with equip", () => {
    it.skip("should parse '[Hidden] When you play this from face down, attach it to a unit you control here. [Equip]'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)When you play this from face down, attach it to a unit you control here.[Equip] :rb_rune_chaos: (:rb_rune_chaos:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("hidden with replacement effects", () => {
    it.skip("should parse '[Hidden] The next time a friendly unit would die, kill this instead.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)The next time a friendly unit would die, kill this instead. Recall that unit exhausted. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "replacement",
          replaces: "die",
        }),
      );
    });
  });

  describe("hidden with take control", () => {
    it.skip("should parse '[Hidden] Take control of an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)Take control of an enemy unit at a battlefield. Ready it. (Start a combat if other enemies are there. Otherwise, conquer.)Lose control of that unit and recall it at end of turn. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("hidden with token creation", () => {
    it.skip("should parse '[Hidden] Play a 2 :rb_might: Sand Soldier unit token.'", () => {
      const result = parseAbilities(
        "[Hidden]_ (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)_Play a 2 :rb_might: Sand Soldier unit token. You may pay :rb_rune_order: to ready it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });

    it.skip("should parse '[Hidden] Friendly units enter ready this turn. Play a Gold gear token exhausted.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)Friendly units enter ready this turn. Play a Gold gear token exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });
});
