/**
 * Parser tests for Equip keyword
 *
 * Tests for parsing [Equip] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Costs } from "../helpers";

describe("Keyword: Equip", () => {
  describe("equip with single domain", () => {
    it.skip("should parse '[Equip] :rb_rune_body:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_body: (:rb_rune_body:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("body"))),
      );
    });

    it.skip("should parse '[Equip] :rb_rune_calm:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_calm: (:rb_rune_calm:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("calm"))),
      );
    });

    it.skip("should parse '[Equip] :rb_rune_chaos:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_chaos: (:rb_rune_chaos:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("chaos"))),
      );
    });

    it.skip("should parse '[Equip] :rb_rune_fury:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_fury: (:rb_rune_fury:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("fury"))),
      );
    });

    it.skip("should parse '[Equip] :rb_rune_mind:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_mind: (:rb_rune_mind:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("mind"))),
      );
    });

    it.skip("should parse '[Equip] :rb_rune_order:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_rune_order: (:rb_rune_order:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("order"))),
      );
    });
  });

  describe("equip with energy and domain", () => {
    it.skip("should parse '[Equip] :rb_energy_1::rb_rune_body:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_energy_1::rb_rune_body: (:rb_energy_1::rb_rune_body:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(
          Abilities.equip(Costs.energyAndPower(1, "body")),
        ),
      );
    });

    it.skip("should parse '[Equip] :rb_energy_1::rb_rune_calm:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_energy_1::rb_rune_calm: (:rb_energy_1::rb_rune_calm:: Attach this to a unit you control.)As this is attached to a unit, copy that unit's text to this Equipment's effect text for as long as this is attached to it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(
          Abilities.equip(Costs.energyAndPower(1, "calm")),
        ),
      );
    });

    it.skip("should parse '[Equip] :rb_energy_1::rb_rune_fury:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_energy_1::rb_rune_fury: (:rb_energy_1::rb_rune_fury:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(
          Abilities.equip(Costs.energyAndPower(1, "fury")),
        ),
      );
    });

    it.skip("should parse '[Equip] :rb_energy_1::rb_rune_mind:'", () => {
      const result = parseAbilities(
        "[Equip] :rb_energy_1::rb_rune_mind: (:rb_energy_1::rb_rune_mind:: Attach this to a unit you control.):rb_energy_3::rb_rune_mind:, Banish this: Play all units banished with this, ignoring their costs. (Use only if unattached.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("equip with alternative costs", () => {
    it.skip("should parse '[Equip] — :rb_rune_chaos:, Recycle 2 cards from your trash'", () => {
      const result = parseAbilities(
        "[Equip] — :rb_rune_chaos:, Recycle 2 cards from your trash (Pay the cost:** **Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Equip",
          cost: expect.objectContaining({
            power: expect.arrayContaining(["chaos"]),
            recycle: 2,
          }),
        }),
      );
    });

    it.skip("should parse '[Equip] — :rb_rune_order:, Kill a friendly unit'", () => {
      const result = parseAbilities(
        "[Equip] — :rb_rune_order:, Kill a friendly unit (Pay the cost: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Equip",
        }),
      );
    });
  });

  describe("equip with hidden", () => {
    it.skip("should parse '[Hidden] When you play this from face down, attach it to a unit you control here. [Equip] :rb_rune_chaos:'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)When you play this from face down, attach it to a unit you control here.[Equip] :rb_rune_chaos: (:rb_rune_chaos:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.hidden()),
      );
      expect(result.abilities?.[2]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("chaos"))),
      );
    });
  });

  describe("equip with quick-draw", () => {
    it.skip("should parse '[Quick-Draw][Equip] :rb_rune_calm:'", () => {
      const result = parseAbilities(
        "[Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)[Equip] :rb_rune_calm: (:rb_rune_calm:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.quickDraw()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("calm"))),
      );
    });
  });

  describe("equip with unique", () => {
    it.skip("should parse '[Unique][Equip] :rb_rune_rainbow:'", () => {
      const result = parseAbilities(
        "[Unique]** **(Your deck can have only 1 card with this name.)[Equip] :rb_rune_rainbow: (:rb_rune_rainbow:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.unique()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("rainbow"))),
      );
    });
  });
});
