/**
 * Parser tests for Repeat keyword
 *
 * Tests for parsing [Repeat] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Costs, Effects } from "../helpers";

describe("Keyword: Repeat", () => {
  describe("repeat with energy cost", () => {
    it.skip("should parse '[Action][Repeat] :rb_energy_1: Give a unit [Assault 2].'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)[Repeat] :rb_energy_1: (You may pay the additional cost to repeat this spell's effect.)Give a unit [Assault 2]. (+2 :rb_might: while it's an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
          repeat: expect.objectContaining({
            energy: 1,
          }),
        }),
      );
    });

    it.skip("should parse '[Action][Repeat] :rb_energy_2: Stun an attacking unit.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Stun an attacking unit. (It doesn't deal combat damage this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
          repeat: expect.objectContaining({
            energy: 2,
          }),
        }),
      );
    });

    it.skip("should parse '[Action][Repeat] :rb_energy_3: Choose a friendly unit anywhere and an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)[Repeat] :rb_energy_3: (You may pay the additional cost to repeat this spell's effect.)Choose a friendly unit anywhere and an enemy unit at a battlefield. They deal damage equal to their Mights to each other.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          repeat: expect.objectContaining({
            energy: 3,
          }),
        }),
      );
    });
  });

  describe("repeat with energy and power cost", () => {
    it.skip("should parse '[Action][Repeat] :rb_energy_1::rb_rune_mind: Deal 1 to up to three units at the same location.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)[Repeat] :rb_energy_1::rb_rune_mind: (You may pay the additional cost to repeat this spell's effect.)Deal 1 to up to three units at the same location.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          repeat: expect.objectContaining({
            energy: 1,
            power: expect.arrayContaining(["mind"]),
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction][Repeat] :rb_energy_1::rb_rune_rainbow: Give your Mechs +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)[Repeat] :rb_energy_1::rb_rune_rainbow: (You may pay the additional cost to repeat this spell's effect.)Give your Mechs +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          repeat: expect.objectContaining({
            energy: 1,
            power: expect.arrayContaining(["rainbow"]),
          }),
        }),
      );
    });

    it.skip("should parse '[Repeat] :rb_energy_2::rb_rune_fury: Deal 2 to a unit at a battlefield, then deal 2 to up to one other unit.'", () => {
      const result = parseAbilities(
        "[Repeat] :rb_energy_2::rb_rune_fury: (You may pay the additional cost to repeat this spell's effect.)Deal 2 to a unit at a battlefield, then deal 2 to up to one other unit.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          repeat: expect.objectContaining({
            energy: 2,
            power: expect.arrayContaining(["fury"]),
          }),
        }),
      );
    });

    it.skip("should parse '[Repeat] :rb_energy_4::rb_rune_mind: Choose one — Deal 4 to a unit in a base. Kill a gear.'", () => {
      const result = parseAbilities(
        "[Repeat] :rb_energy_4::rb_rune_mind: (You may pay the additional cost to repeat this spell's effect, and may make different choices.)Choose one —Deal 4 to a unit in a base.Kill a gear.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          repeat: expect.objectContaining({
            energy: 4,
            power: expect.arrayContaining(["mind"]),
          }),
          effect: expect.objectContaining({
            type: "choice",
          }),
        }),
      );
    });
  });

  describe("repeat with power-only cost", () => {
    it.skip("should parse '[Action][Repeat] :rb_rune_chaos: Look at the top 2 cards of your Main Deck.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)[Repeat] :rb_rune_chaos: (You may pay the additional cost to repeat this spell's effect.)Look at the top 2 cards of your Main Deck. Draw one and recycle the other.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          repeat: expect.objectContaining({
            power: expect.arrayContaining(["chaos"]),
          }),
        }),
      );
    });
  });

  describe("repeat in reaction spells", () => {
    it.skip("should parse '[Reaction][Repeat] :rb_energy_2: Counter a spell unless its controller pays :rb_energy_2:.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Counter a spell unless its controller pays :rb_energy_2:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "counter",
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction][Repeat] :rb_energy_2: Give a unit +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Give a unit +2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: 2,
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction][Repeat] :rb_energy_2: Give a unit -2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Give a unit -2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: -2,
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction][Repeat] :rb_energy_2: Give two friendly units each +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Give two friendly units each +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("repeat without timing keyword", () => {
    it.skip("should parse '[Repeat] :rb_energy_2: Move an enemy unit to a location where there's a unit with the same controller.'", () => {
      const result = parseAbilities(
        "[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Move an enemy unit to a location where there's a unit with the same controller.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "move",
          }),
        }),
      );
    });

    it.skip("should parse '[Repeat] :rb_energy_2: Play a 2 :rb_might: Sand Soldier unit token.'", () => {
      const result = parseAbilities(
        "[Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)Play a 2 :rb_might: Sand Soldier unit token.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "create-token",
          }),
        }),
      );
    });
  });

  describe("repeat cost reduction", () => {
    it.skip("should parse 'While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.'", () => {
      const result = parseAbilities(
        "While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });
  });

  describe("granting repeat", () => {
    it.skip("should parse ':rb_rune_rainbow:, :rb_exhaust:: Give the next spell you play this turn [Repeat] equal to its cost.'", () => {
      const result = parseAbilities(
        ":rb_rune_rainbow:, :rb_exhaust:: Give the next spell you play this turn [Repeat] equal to its cost. (You may pay the additional cost to repeat the spell's effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
        }),
      );
    });
  });
});
