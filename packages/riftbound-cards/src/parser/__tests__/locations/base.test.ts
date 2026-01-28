/**
 * Parser tests for base location abilities
 *
 * Tests for parsing abilities that reference bases.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets } from "../helpers";

describe("Location: Base", () => {
  describe("in base", () => {
    it.skip("should parse 'Deal damage equal to my Might to an enemy unit in a base.'", () => {
      const result = parseAbilities(
        "Deal damage equal to my Might to an enemy unit in a base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "damage",
            target: expect.objectContaining({
              location: "base",
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'Deal 4 to a unit in a base.'", () => {
      const result = parseAbilities("Deal 4 to a unit in a base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("to base", () => {
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

  describe("to your base", () => {
    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities(
        "Play a 1 :rb_might: Recruit unit token to your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "create-token",
            location: "base",
          }),
        }),
      );
    });

    it.skip("should parse 'Play two 3 :rb_might: Mech unit tokens to your base.'", () => {
      const result = parseAbilities(
        "Play two 3 :rb_might: Mech unit tokens to your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("from base", () => {
    it.skip("should parse 'You may move a friendly unit from your base to here.'", () => {
      const result = parseAbilities(
        "You may move a friendly unit from your base to here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("units in your base", () => {
    it.skip("should parse 'I enter ready if you have two or more other units in your base.'", () => {
      const result = parseAbilities(
        "I enter ready if you have two or more other units in your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
