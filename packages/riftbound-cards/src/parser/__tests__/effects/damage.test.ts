/**
 * Parser tests for damage effects
 *
 * Tests for parsing abilities that deal damage.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Damage", () => {
  describe("fixed damage", () => {
    it.skip("should parse 'Deal 2 to a unit.'", () => {
      const result = parseAbilities("Deal 2 to a unit.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            type: "damage",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Deal 3 to a unit at a battlefield.'", () => {
      const result = parseAbilities("Deal 3 to a unit at a battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("split damage", () => {
    it.skip("should parse 'Deal 5 damage split among any number of enemy units here.'", () => {
      const result = parseAbilities("Deal 5 damage split among any number of enemy units here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 5,
            split: true,
            type: "damage",
          }),
          type: "spell",
        }),
      );
    });
  });

  describe("damage to all", () => {
    it.skip("should parse 'Deal 1 to all units at battlefields.'", () => {
      const result = parseAbilities("Deal 1 to all units at battlefields.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Deal 4 to all units at my battlefield.'", () => {
      const result = parseAbilities("Deal 4 to all units at my battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("damage equal to might", () => {
    it.skip("should parse 'Deal damage equal to my Might to an enemy unit.'", () => {
      const result = parseAbilities("Deal damage equal to my Might to an enemy unit.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: expect.objectContaining({
              of: "self",
              type: "might",
            }),
            type: "damage",
          }),
          type: "spell",
        }),
      );
    });
  });
});
