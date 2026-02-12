/**
 * Parser tests for Unique keyword
 *
 * Tests for parsing [Unique] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Costs, Effects } from "../helpers";

describe("Keyword: Unique", () => {
  describe("unique with equip", () => {
    it.skip("should parse '[Unique][Equip] :rb_rune_rainbow:'", () => {
      const result = parseAbilities(
        "[Unique]** **(Your deck can have only 1 card with this name.)[Equip] :rb_rune_rainbow: (:rb_rune_rainbow:: Attach this to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.unique()));
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("rainbow"))),
      );
    });
  });

  describe("unique with equip and triggered ability", () => {
    it.skip("should parse '[Unique][Equip] :rb_rune_rainbow: When you play this, ready your units.'", () => {
      const result = parseAbilities(
        "[Unique]** **(Your deck can have only 1 card with this name.)[Equip] :rb_rune_rainbow: (:rb_rune_rainbow:: Attach this to a unit you control.)When you play this, ready your units.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.unique()));
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.equip(Costs.power("rainbow"))),
      );
      expect(result.abilities?.[2]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "ready",
          }),
          trigger: expect.objectContaining({
            event: "play-self",
          }),
          type: "triggered",
        }),
      );
    });
  });
});
