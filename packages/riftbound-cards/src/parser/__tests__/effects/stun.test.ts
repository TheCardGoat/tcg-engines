/**
 * Parser tests for stun effects
 *
 * Tests for parsing abilities that stun units.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Stun", () => {
  describe("stun target", () => {
    it.skip("should parse 'Stun a unit.'", () => {
      const result = parseAbilities("Stun a unit. (It doesn't deal combat damage this turn.)");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "stun",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Stun an attacking unit.'", () => {
      const result = parseAbilities(
        "Stun an attacking unit. (It doesn't deal combat damage this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Stun an enemy unit here.'", () => {
      const result = parseAbilities(
        "Stun an enemy unit here. (It doesn't deal combat damage this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("stun with additional effects", () => {
    it.skip("should parse 'Stun an enemy unit at a battlefield. You may move a friendly unit to that enemy unit's battlefield.'", () => {
      const result = parseAbilities(
        "Stun an enemy unit at a battlefield. You may move a friendly unit to that enemy unit's battlefield. (A stunned unit doesn't deal combat damage this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
