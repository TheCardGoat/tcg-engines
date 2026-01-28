/**
 * Parser tests for draw effects
 *
 * Tests for parsing abilities that draw cards.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Draw", () => {
  describe("fixed draw", () => {
    it.skip("should parse 'Draw 1.'", () => {
      const result = parseAbilities("Draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'Draw 2.'", () => {
      const result = parseAbilities("Draw 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Draw 3.'", () => {
      const result = parseAbilities("Draw 3.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("conditional draw", () => {
    it.skip("should parse 'Draw 1 for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "Draw 1 for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "draw",
            amount: expect.objectContaining({
              type: "count",
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'Draw 1 for each other friendly unit here.'", () => {
      const result = parseAbilities(
        "Draw 1 for each other friendly unit here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("opponent draw", () => {
    it.skip("should parse 'Its controller draws 2.'", () => {
      const result = parseAbilities(
        "Kill a unit at a battlefield. Its controller draws 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
