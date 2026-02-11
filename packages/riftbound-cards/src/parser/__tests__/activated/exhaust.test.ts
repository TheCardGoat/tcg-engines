/**
 * Parser tests for exhaust-cost activated abilities
 *
 * Tests for parsing activated abilities that require exhausting.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Costs, Effects } from "../helpers";

describe("Activated: Exhaust Cost", () => {
  describe("draw effects", () => {
    it.skip("should parse ':rb_exhaust:: Draw 1.'", () => {
      const result = parseAbilities(":rb_exhaust:: Draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          cost: expect.objectContaining({
            exhaust: true,
          }),
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          type: "activated",
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: Draw 2.'", () => {
      const result = parseAbilities(":rb_exhaust:: Draw 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse ':rb_exhaust:: Give a unit +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(":rb_exhaust:: Give a unit +2 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          cost: expect.objectContaining({
            exhaust: true,
          }),
          effect: expect.objectContaining({
            amount: 2,
            type: "modify-might",
          }),
          type: "activated",
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: Give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(":rb_exhaust:: Give me +1 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("keyword granting effects", () => {
    it.skip("should parse ':rb_exhaust:: Give a unit [Ganking] this turn.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: Give a unit [Ganking] this turn. (It can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Ganking",
            type: "grant-keyword",
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("buff effects", () => {
    it.skip("should parse ':rb_exhaust:: Buff a friendly unit.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: Buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "buff",
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("damage effects", () => {
    it.skip("should parse ':rb_exhaust:: Deal 2 to a unit at a battlefield.'", () => {
      const result = parseAbilities(":rb_exhaust:: Deal 2 to a unit at a battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            type: "damage",
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("movement effects", () => {
    it.skip("should parse ':rb_exhaust:: Move a friendly unit.'", () => {
      const result = parseAbilities(":rb_exhaust:: Move a friendly unit.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "move",
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("exhaust with energy cost", () => {
    it.skip("should parse ':rb_energy_1:, :rb_exhaust:: Draw 1.'", () => {
      const result = parseAbilities(":rb_energy_1:, :rb_exhaust:: Draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          cost: expect.objectContaining({
            energy: 1,
            exhaust: true,
          }),
          type: "activated",
        }),
      );
    });

    it.skip("should parse ':rb_energy_2:, :rb_exhaust:: Draw 2.'", () => {
      const result = parseAbilities(":rb_energy_2:, :rb_exhaust:: Draw 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("exhaust with power cost", () => {
    it.skip("should parse ':rb_rune_rainbow:, :rb_exhaust:: Draw 1.'", () => {
      const result = parseAbilities(":rb_rune_rainbow:, :rb_exhaust:: Draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          cost: expect.objectContaining({
            exhaust: true,
            power: expect.arrayContaining(["rainbow"]),
          }),
          type: "activated",
        }),
      );
    });

    it.skip("should parse ':rb_rune_fury:, :rb_exhaust:: Give me +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        ":rb_rune_fury:, :rb_exhaust:: Give me +2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("exhaust with energy and power cost", () => {
    it.skip("should parse ':rb_energy_1::rb_rune_body:, :rb_exhaust:: Buff a friendly unit.'", () => {
      const result = parseAbilities(
        ":rb_energy_1::rb_rune_body:, :rb_exhaust:: Buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          cost: expect.objectContaining({
            energy: 1,
            exhaust: true,
            power: expect.arrayContaining(["body"]),
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("legion condition", () => {
    it.skip("should parse ':rb_exhaust:: [Legion] — The next unit you play this turn enters ready.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Legion] — The next unit you play this turn enters ready. (Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "legion",
          }),
          type: "activated",
        }),
      );
    });
  });

  describe("reaction timing", () => {
    it.skip("should parse ':rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:. (Abilities that add resources can't be reacted to. Get the effect if you've played a card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          timing: "reaction",
          type: "activated",
        }),
      );
    });
  });

  describe("token creation", () => {
    it.skip("should parse ':rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base.'", () => {
      const result = parseAbilities(
        ":rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base. Use only if you've played an Equipment this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "create-token",
          }),
          type: "activated",
        }),
      );
    });
  });
});
