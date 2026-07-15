/**
 * Parser tests for Accelerate keyword
 *
 * Tests for parsing [Accelerate] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Costs } from "../helpers";

describe("Keyword: Accelerate", () => {
  describe("accelerate with fury", () => {
    it.skip("should parse '[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "fury"))),
      );
    });

    it.skip("should parse '[Accelerate][Assault 2] When you play me, discard 2.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)[Assault 2] (+2 :rb_might: while I'm an attacker.)When you play me, discard 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          keyword: "Accelerate",
          type: "keyword",
        }),
      );
      expect(result.abilities?.[1]).toEqual(expect.objectContaining(Abilities.assault(2)));
    });

    it.skip("should parse '[Accelerate][Weaponmaster]'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(expect.objectContaining(Abilities.weaponmaster()));
    });
  });

  describe("accelerate with body", () => {
    it.skip("should parse '[Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)Other buffed friendly units at my battlefield have +2 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "body"))),
      );
    });

    it.skip("should parse '[Accelerate][Assault] As you play me, you may spend any number of buffs as an additional cost.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)[Assault] (+1 :rb_might: while I'm an attacker.)As you play me, you may spend any number of buffs as an additional cost. Reduce my cost by :rb_rune_body: for each buff you spend.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
    });

    it.skip("should parse '[Accelerate][Ganking] The first time I move each turn, you may ready something else.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)[Ganking] (I can move from battlefield to battlefield.)The first time I move each turn, you may ready something else that's exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
    });
  });

  describe("accelerate with calm", () => {
    it.skip("should parse '[Accelerate][Deathknell] — Channel 2 runes exhausted and draw 1.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_calm: as an additional cost to have me enter ready.)[Deathknell] — Channel 2 runes exhausted and draw 1. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "calm"))),
      );
    });
  });

  describe("accelerate with chaos", () => {
    it.skip("should parse '[Accelerate] If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might: and [Ganking].'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_chaos: as an additional cost to have me enter ready.)If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might: and [Ganking]. (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "chaos"))),
      );
    });

    it.skip("should parse '[Accelerate] I have [Assault] equal to the number of enemy units here.'", () => {
      const result = parseAbilities(
        "[Accelerate] _(Y_ou may pay :rb_energy_1::rb_rune_chaos: as an additional cost to have me enter ready.)I have [Assault] equal to the number of enemy units here. (+1 :rb_might: while I'm an attacker for each instance of Assault.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("accelerate with mind", () => {
    it.skip("should parse '[Accelerate] When you play me, give enemy units -3 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_mind: as an additional cost to have me enter ready.)When you play me, give enemy units -3 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "mind"))),
      );
    });

    it.skip("should parse '[Accelerate][Deathknell] — Recycle me to ready your runes.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_mind: as an additional cost to have me enter ready.)[Deathknell] — Recycle me to ready your runes. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Accelerate] Each Equipment attached to me gives double its base Might bonus.'", () => {
      const result = parseAbilities(
        "[Accelerate]_ _(You may pay :rb_energy_1::rb_rune_mind: as an additional cost to have me enter ready.)Each Equipment attached to me gives double its base Might bonus.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("accelerate with order", () => {
    it.skip("should parse '[Accelerate] When I attack, you may move any number of your token units to this battlefield.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_order: as an additional cost to have me enter ready.)When I attack, you may move any number of your token units to this battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.accelerate(Costs.energyAndPower(1, "order"))),
      );
    });

    it.skip("should parse '[Accelerate] When I move to a battlefield, play three 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_order: as an additional cost to have me enter ready.)When I move to a battlefield, play three 1 :rb_might: Recruit unit tokens here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("accelerate with cost reduction", () => {
    it.skip("should parse '[Accelerate] I cost :rb_energy_2: less for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "[Accelerate]_ _(You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)I cost :rb_energy_2: less for each of your [Mighty] units._ (A unit is Mighty while it has 5+ :rb_might:.)_",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("accelerate granted to others", () => {
    it.skip("should parse '[Accelerate][Assault] Friendly units played from anywhere other than a player's hand have [Accelerate].'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)[Assault]_ (+1 :rb_might: while I'm an attacker.)_Friendly units played from anywhere other than a player's hand have [Accelerate].",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
    });
  });
});
