/**
 * Parser tests for buff effects
 *
 * Tests for parsing abilities that buff units.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Buff", () => {
  describe("buff target", () => {
    it.skip("should parse 'Buff a friendly unit.'", () => {
      const result = parseAbilities(
        "Buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "buff",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Buff me.'", () => {
      const result = parseAbilities(
        "Buff me. (If I don't have a buff, I get a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("spend buff", () => {
    it.skip("should parse 'Spend a buff to draw 1.'", () => {
      const result = parseAbilities("Spend a buff to draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            then: expect.objectContaining({
              type: "draw",
            }),
            type: "spend-buff",
          }),
          type: "spell",
        }),
      );
    });
  });

  describe("buff with additional effects", () => {
    it.skip("should parse 'Buff a friendly unit. Buffs give an additional +1 :rb_might: to friendly units this turn.'", () => {
      const result = parseAbilities(
        "Buff a friendly unit. Buffs give an additional +1 :rb_might: to friendly units this turn. (To buff a unit, give it a +1 :rb_might: buff if it doesn't already have one.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
