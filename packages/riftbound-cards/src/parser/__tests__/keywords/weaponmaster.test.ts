/**
 * Parser tests for Weaponmaster keyword
 *
 * Tests for parsing [Weaponmaster] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Triggers } from "../helpers";

describe("Keyword: Weaponmaster", () => {
  describe("simple weaponmaster", () => {
    it.skip("should parse '[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)'", () => {
      const result = parseAbilities(
        "[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.weaponmaster()),
      );
    });
  });

  describe("weaponmaster with triggered abilities", () => {
    it.skip("should parse '[Weaponmaster] The first time I conquer each turn, ready me.'", () => {
      const result = parseAbilities(
        "[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)The first time I conquer each turn, ready me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.weaponmaster()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "conquer",
          }),
        }),
      );
    });

    it.skip("should parse '[Weaponmaster] When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.'", () => {
      const result = parseAbilities(
        "[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "damage",
          }),
        }),
      );
    });

    it.skip("should parse '[Weaponmaster] When you attach an Equipment to me, you may pay :rb_energy_1: to draw 1.'", () => {
      const result = parseAbilities(
        "[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)When you attach an Equipment to me, you may pay :rb_energy_1: to draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
        }),
      );
    });
  });

  describe("weaponmaster with additional cost", () => {
    it.skip("should parse '[Weaponmaster] You may pay :rb_rune_body::rb_rune_body: as an additional cost to play me.'", () => {
      const result = parseAbilities(
        "[Weaponmaster]You may pay :rb_rune_body::rb_rune_body: as an additional cost to play me.When you play me, if you paid the additional cost, move an enemy gear to your base. You control it until I leave the board. If it's an Equipment, attach it to me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("weaponmaster combined with accelerate", () => {
    it.skip("should parse '[Accelerate][Weaponmaster]'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Accelerate",
        }),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.weaponmaster()),
      );
    });
  });

  describe("weaponmaster combined with deflect", () => {
    it.skip("should parse '[Deflect 2][Weaponmaster] I have +1 :rb_might: for each friendly gear.'", () => {
      const result = parseAbilities(
        "[Deflect 2] (Opponents must pay :rb_rune_rainbow::rb_rune_rainbow: to choose me with a spell or ability.)[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)I have +1 :rb_might: for each friendly gear.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.deflect(2)),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.weaponmaster()),
      );
    });
  });

  describe("weaponmaster granted to others", () => {
    it.skip("should parse 'Sand Soldiers you play have [Weaponmaster].'", () => {
      const result = parseAbilities(
        "Sand Soldiers you play have [Weaponmaster]. (When they're played, you may [Equip] one of your Equipment to them for :rb_rune_rainbow: less.):rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base. Use only if you've played an Equipment this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Weaponmaster",
          }),
        }),
      );
    });

    it.skip("should parse 'Your Sand Soldiers have [Weaponmaster].'", () => {
      const result = parseAbilities(
        "Your Sand Soldiers have [Weaponmaster].:rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base. Use only if you've played an Equipment this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });
});
