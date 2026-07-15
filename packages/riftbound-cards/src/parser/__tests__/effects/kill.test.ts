/**
 * Parser tests for kill effects
 *
 * Tests for parsing abilities that kill units or gear.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Kill", () => {
  describe("kill unit", () => {
    it.skip("should parse 'Kill a unit at a battlefield.'", () => {
      const result = parseAbilities("Kill a unit at a battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "kill",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Kill a unit at a battlefield with 2 :rb_might: or less.'", () => {
      const result = parseAbilities("Kill a unit at a battlefield with 2 :rb_might: or less.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("kill gear", () => {
    it.skip("should parse 'Kill a gear.'", () => {
      const result = parseAbilities("Kill a gear.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "kill",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Kill all gear.'", () => {
      const result = parseAbilities("Kill all gear.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("kill with conditions", () => {
    it.skip("should parse 'Kill any number of units at a battlefield with total Might 4 or less.'", () => {
      const result = parseAbilities(
        "Kill any number of units at a battlefield with total Might 4 or less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
