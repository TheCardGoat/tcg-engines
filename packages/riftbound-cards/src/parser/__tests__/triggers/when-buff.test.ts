/**
 * Parser tests for "When buff" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit is buffed.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Buff", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When you buff a friendly unit, draw 1.'", () => {
      const result = parseAbilities("When you buff a friendly unit, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "buff",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When I'm buffed, give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities("When I'm buffed, give me +1 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "modify-might",
          }),
          trigger: expect.objectContaining({
            event: "buff",
            on: "self",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("spend buff triggers", () => {
    it.skip("should parse 'When you spend a buff, draw 1.'", () => {
      const result = parseAbilities("When you spend a buff, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "spend-buff",
          }),
          type: "triggered",
        }),
      );
    });
  });
});
