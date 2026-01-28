/**
 * Parser tests for Sand Soldier tribal abilities
 *
 * Tests for parsing abilities that reference Sand Soldiers.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets, Tokens } from "../helpers";

describe("Tribal: Sand Soldier", () => {
  describe("sand soldier keyword grants", () => {
    it.skip("should parse 'Sand Soldiers you play have [Weaponmaster].'", () => {
      const result = parseAbilities(
        "Sand Soldiers you play have [Weaponmaster]. (When they're played, you may [Equip] one of your Equipment to them for :rb_rune_rainbow: less.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Weaponmaster",
            target: expect.objectContaining({
              filter: expect.objectContaining({
                tag: "Sand Soldier",
              }),
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'Your Sand Soldiers have [Weaponmaster].'", () => {
      const result = parseAbilities("Your Sand Soldiers have [Weaponmaster].");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("sand soldier tokens", () => {
    it.skip("should parse 'Play a 2 :rb_might: Sand Soldier unit token.'", () => {
      const result = parseAbilities(
        "Play a 2 :rb_might: Sand Soldier unit token.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "create-token",
            token: expect.objectContaining({
              name: "Sand Soldier",
              type: "unit",
              might: 2,
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'Play a 2 :rb_might: Sand Soldier unit token to your base.'", () => {
      const result = parseAbilities(
        "Play a 2 :rb_might: Sand Soldier unit token to your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Play a 2 :rb_might: Sand Soldier unit token. You may pay :rb_rune_order: to ready it.'", () => {
      const result = parseAbilities(
        "Play a 2 :rb_might: Sand Soldier unit token. You may pay :rb_rune_order: to ready it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("sand soldier activated abilities", () => {
    it.skip("should parse ':rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base.'", () => {
      const result = parseAbilities(
        ":rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base. Use only if you've played an Equipment this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "create-token",
          }),
        }),
      );
    });
  });
});
