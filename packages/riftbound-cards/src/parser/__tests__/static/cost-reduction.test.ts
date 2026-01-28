/**
 * Parser tests for cost reduction static abilities
 *
 * Tests for parsing static abilities that reduce costs.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities } from "../helpers";

describe("Static: Cost Reduction", () => {
  describe("self cost reduction", () => {
    it.skip("should parse 'I cost :rb_energy_2: less for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "I cost :rb_energy_2: less for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'I cost :rb_energy_2::rb_rune_calm: less for each point you scored from holding this turn.'", () => {
      const result = parseAbilities(
        "I cost :rb_energy_2::rb_rune_calm: less for each point you scored from holding this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'I cost :rb_energy_2: less to play from anywhere other than your hand.'", () => {
      const result = parseAbilities(
        "I cost :rb_energy_2: less to play from anywhere other than your hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("spell cost reduction", () => {
    it.skip("should parse 'This spell's Energy cost is reduced by the highest Might among units you control.'", () => {
      const result = parseAbilities(
        "This spell's Energy cost is reduced by the highest Might among units you control.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("other cards cost reduction", () => {
    it.skip("should parse 'While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.'", () => {
      const result = parseAbilities(
        "While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          condition: expect.objectContaining({
            type: "control-battlefield",
          }),
        }),
      );
    });
  });

  describe("conditional cost reduction", () => {
    it.skip("should parse 'If an enemy unit has died this turn, this costs :rb_energy_2: less.'", () => {
      const result = parseAbilities(
        "If an enemy unit has died this turn, this costs :rb_energy_2: less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
