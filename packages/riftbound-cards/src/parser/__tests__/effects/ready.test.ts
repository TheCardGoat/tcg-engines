/**
 * Parser tests for ready effects
 *
 * Tests for parsing abilities that ready units or other permanents.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Ready", () => {
  describe("ready self", () => {
    it("should parse 'Ready me.'", () => {
      const result = parseAbilities("Ready me.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "ready",
          }),
        }),
      );
    });
  });

  describe("ready target", () => {
    it("should parse 'Ready a unit.'", () => {
      const result = parseAbilities("Ready a unit.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it("should parse 'Ready your units.'", () => {
      const result = parseAbilities("Ready your units.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it("should parse 'Ready your runes.'", () => {
      const result = parseAbilities("Ready your runes.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("ready with additional effects", () => {
    it.skip("should parse 'Ready a friendly unit. It deals damage equal to its Might to an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "Ready a friendly unit. It deals damage equal to its Might to an enemy unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("ready something else", () => {
    it.skip("should parse 'You may ready something else that's exhausted.'", () => {
      const result = parseAbilities(
        "You may ready something else that's exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
