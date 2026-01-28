/**
 * Parser tests for additional cost abilities
 *
 * Tests for parsing abilities with additional costs.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Costs } from "../helpers";

describe("Cost: Additional", () => {
  describe("optional additional cost", () => {
    it.skip("should parse 'As you play me, you may kill any number of friendly units as an additional cost.'", () => {
      const result = parseAbilities(
        "As you play me, you may kill any number of friendly units as an additional cost. Reduce my cost by :rb_rune_order: for each killed this way.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'As you play me, you may spend any number of buffs as an additional cost.'", () => {
      const result = parseAbilities(
        "As you play me, you may spend any number of buffs as an additional cost. Reduce my cost by :rb_rune_body: for each buff you spend.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'As you play this, you may spend a buff as an additional cost. If you do, ignore this spell's cost.'", () => {
      const result = parseAbilities(
        "As you play this, you may spend a buff as an additional cost. If you do, ignore this spell's cost.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("required additional cost", () => {
    it.skip("should parse 'You may pay :rb_rune_body::rb_rune_body: as an additional cost to play me.'", () => {
      const result = parseAbilities(
        "You may pay :rb_rune_body::rb_rune_body: as an additional cost to play me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("conditional on additional cost", () => {
    it.skip("should parse 'When you play me, if you paid the additional cost, move an enemy gear to your base.'", () => {
      const result = parseAbilities(
        "When you play me, if you paid the additional cost, move an enemy gear to your base. You control it until I leave the board. If it's an Equipment, attach it to me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          condition: expect.objectContaining({
            type: "paid-additional-cost",
          }),
        }),
      );
    });
  });
});
