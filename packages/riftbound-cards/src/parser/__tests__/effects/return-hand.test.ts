/**
 * Parser tests for return to hand effects
 *
 * Tests for parsing abilities that return cards to hand.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Return to Hand", () => {
  describe("return unit", () => {
    it.skip("should parse 'Return a unit at a battlefield to its owner's hand.'", () => {
      const result = parseAbilities(
        "Return a unit at a battlefield to its owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "return-to-hand",
          }),
        }),
      );
    });

    it.skip("should parse 'Return me to my owner's hand.'", () => {
      const result = parseAbilities("Return me to my owner's hand.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("return gear", () => {
    it.skip("should parse 'Return a gear to its owner's hand.'", () => {
      const result = parseAbilities("Return a gear to its owner's hand.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("return from trash", () => {
    it.skip("should parse 'Return a unit from your trash to your hand.'", () => {
      const result = parseAbilities(
        "Return a unit from your trash to your hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("return with conditions", () => {
    it.skip("should parse 'Return a unit at a battlefield with 3 :rb_might: or less to its owner's hand.'", () => {
      const result = parseAbilities(
        "Return a unit at a battlefield with 3 :rb_might: or less to its owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
