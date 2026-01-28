/**
 * Parser tests for resource-adding activated abilities
 *
 * Tests for parsing activated abilities that add resources (energy/power).
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Costs, Effects } from "../helpers";

describe("Activated: Resource Add", () => {
  describe("add energy", () => {
    it.skip("should parse ':rb_exhaust:: [Add] :rb_energy_1:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_energy_1:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          cost: expect.objectContaining({
            exhaust: true,
          }),
          effect: expect.objectContaining({
            type: "add-resource",
            energy: 1,
          }),
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_energy_2:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_energy_2:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "add-resource",
            energy: 2,
          }),
        }),
      );
    });
  });

  describe("add power", () => {
    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_fury:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_fury:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "add-resource",
            power: expect.arrayContaining(["fury"]),
          }),
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_calm:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_calm:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "add-resource",
            power: expect.arrayContaining(["calm"]),
          }),
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_mind:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_mind:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_body:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_body:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_chaos:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_chaos:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_order:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_order:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse ':rb_exhaust:: [Add] :rb_rune_rainbow:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_rune_rainbow:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("add energy and power", () => {
    it.skip("should parse ':rb_exhaust:: [Add] :rb_energy_1::rb_rune_fury:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_energy_1::rb_rune_fury:. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "add-resource",
            energy: 1,
            power: expect.arrayContaining(["fury"]),
          }),
        }),
      );
    });
  });

  describe("conditional resource add", () => {
    it.skip("should parse ':rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:. (Abilities that add resources can't be reacted to. Get the effect if you've played a card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          timing: "reaction",
          condition: expect.objectContaining({
            type: "legion",
          }),
        }),
      );
    });
  });

  describe("resource add with additional effects", () => {
    it.skip("should parse ':rb_exhaust:: [Add] :rb_energy_1:. Draw 1.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Add] :rb_energy_1:. Draw 1. (Abilities that add resources can't be reacted to.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "sequence",
          }),
        }),
      );
    });
  });
});
