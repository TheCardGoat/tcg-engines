/**
 * Parser tests for move effects
 *
 * Tests for parsing abilities that move units.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Move", () => {
  describe("move friendly unit", () => {
    it.skip("should parse 'Move a friendly unit.'", () => {
      const result = parseAbilities("Move a friendly unit.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "move",
          }),
        }),
      );
    });

    it.skip("should parse 'Move a friendly unit and ready it.'", () => {
      const result = parseAbilities("Move a friendly unit and ready it.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("move to specific location", () => {
    it.skip("should parse 'Move a unit from a battlefield to its base.'", () => {
      const result = parseAbilities(
        "Move a unit from a battlefield to its base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "move",
            from: "battlefield",
            to: "base",
          }),
        }),
      );
    });

    it.skip("should parse 'Move up to 2 friendly units to base.'", () => {
      const result = parseAbilities("Move up to 2 friendly units to base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("move enemy unit", () => {
    it.skip("should parse 'Move an enemy unit to here.'", () => {
      const result = parseAbilities("Move an enemy unit to here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Move an enemy unit to a location where there's a unit with the same controller.'", () => {
      const result = parseAbilities(
        "Move an enemy unit to a location where there's a unit with the same controller.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
