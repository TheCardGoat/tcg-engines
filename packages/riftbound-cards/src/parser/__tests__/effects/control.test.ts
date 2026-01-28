/**
 * Parser tests for take control effects
 *
 * Tests for parsing abilities that take control of units or spells.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Take Control", () => {
  describe("take control of unit", () => {
    it.skip("should parse 'Take control of an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "Take control of an enemy unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "take-control",
          }),
        }),
      );
    });

    it.skip("should parse 'Take control of an enemy unit at a battlefield. Ready it.'", () => {
      const result = parseAbilities(
        "Take control of an enemy unit at a battlefield. Ready it. (Start a combat if other enemies are there. Otherwise, conquer.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("take control with duration", () => {
    it.skip("should parse 'Take control of it and recall it.'", () => {
      const result = parseAbilities(
        "Choose an enemy unit at a battlefield. Take control of it and recall it. (Send it to your base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Lose control of that unit and recall it at end of turn.'", () => {
      const result = parseAbilities(
        "Lose control of that unit and recall it at end of turn. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("take control of spell", () => {
    it.skip("should parse 'Gain control of a spell. You may make new choices for it.'", () => {
      const result = parseAbilities(
        "Gain control of a spell. You may make new choices for it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "gain-control-of-spell",
            newChoices: true,
          }),
        }),
      );
    });
  });

  describe("take control of gear", () => {
    it.skip("should parse 'Move an enemy gear to your base. You control it until I leave the board.'", () => {
      const result = parseAbilities(
        "Move an enemy gear to your base. You control it until I leave the board. If it's an Equipment, attach it to me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
