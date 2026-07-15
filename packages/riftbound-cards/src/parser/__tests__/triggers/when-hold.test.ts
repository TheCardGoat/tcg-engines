/**
 * Parser tests for "When I hold" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit holds.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Hold", () => {
  describe("return to hand effects", () => {
    it.skip("should parse 'When I hold, return me to my owner's hand.'", () => {
      const result = parseAbilities("When I hold, return me to my owner's hand.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "return-to-hand",
          }),
          trigger: expect.objectContaining({
            event: "hold",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("draw effects", () => {
    it.skip("should parse 'When I hold, draw 1.'", () => {
      const result = parseAbilities("When I hold, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "hold",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("channel effects", () => {
    it.skip("should parse 'When I hold, channel 1 rune exhausted.'", () => {
      const result = parseAbilities("When I hold, channel 1 rune exhausted.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            exhausted: true,
            type: "channel",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("buff effects", () => {
    it.skip("should parse 'When I hold, buff me.'", () => {
      const result = parseAbilities(
        "When I hold, buff me. (If I don't have a buff, I get a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "buff",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("other unit hold triggers", () => {
    it.skip("should parse 'When a friendly unit holds, draw 1.'", () => {
      const result = parseAbilities("When a friendly unit holds, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          trigger: expect.objectContaining({
            event: "hold",
            on: expect.objectContaining({
              controller: "friendly",
              type: "unit",
            }),
          }),
          type: "triggered",
        }),
      );
    });
  });
});
