/**
 * Parser tests for Quick-Draw keyword
 *
 * Tests for parsing [Quick-Draw] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Costs } from "../helpers";

describe("Keyword: Quick-Draw", () => {
  describe("quick-draw with equip calm", () => {
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

  describe("quick-draw with equip fury", () => {
    it.skip("should parse '[Quick-Draw][Equip] :rb_rune_fury:'", () => {
      const result = parseAbilities(
        "[Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)[Equip] :rb_rune_fury: (:rb_rune_fury:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.quickDraw()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("fury"))),
      );
    });
  });

  describe("quick-draw with equip mind", () => {
    it.skip("should parse '[Quick-Draw][Equip] :rb_rune_mind:'", () => {
      const result = parseAbilities(
        "[Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)[Equip] :rb_rune_mind: (:rb_rune_mind:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.quickDraw()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("mind"))),
      );
    });
  });

  describe("quick-draw with equip rainbow and temporary", () => {
    it.skip("should parse '[Quick-Draw][Equip] :rb_rune_rainbow:[Temporary]'", () => {
      const result = parseAbilities(
        "[Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)[Equip] :rb_rune_rainbow: (:rb_rune_rainbow:: Attach this to a unit you control.)[Temporary] (If this is unattached, kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.quickDraw()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("rainbow"))),
      );
      expect(result.abilities?.[2]).toEqual(
        expect.objectContaining(Abilities.temporary()),
      );
    });
  });

  describe("quick-draw granted to others", () => {
    it.skip("should parse 'Each Equipment in your hand has [Quick-Draw].'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)Each Equipment in your hand has [Quick-Draw]. (It gains [Reaction]. When you play it, attach it to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Quick-Draw",
          }),
        }),
      );
    });
  });
});
