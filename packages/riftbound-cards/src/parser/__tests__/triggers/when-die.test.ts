/**
 * Parser tests for "When I die" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit dies.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Die", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When I die, draw 1.'", () => {
      const result = parseAbilities("When I die, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "die",
          }),
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'When I die, draw 2.'", () => {
      const result = parseAbilities("When I die, draw 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("channel effects", () => {
    it.skip("should parse 'When I die, channel 1 rune exhausted.'", () => {
      const result = parseAbilities("When I die, channel 1 rune exhausted.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "channel",
            amount: 1,
            exhausted: true,
          }),
        }),
      );
    });
  });

  describe("token creation effects", () => {
    it.skip("should parse 'When I die, play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities(
        "When I die, play a 1 :rb_might: Recruit unit token to your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "create-token",
          }),
        }),
      );
    });
  });

  describe("damage effects", () => {
    it.skip("should parse 'When I die, deal 2 to all enemy units at my battlefield.'", () => {
      const result = parseAbilities(
        "When I die, deal 2 to all enemy units at my battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "damage",
            amount: 2,
          }),
        }),
      );
    });
  });

  describe("recycle effects", () => {
    it.skip("should parse 'When I die, recycle me.'", () => {
      const result = parseAbilities("When I die, recycle me.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "recycle",
          }),
        }),
      );
    });
  });

  describe("other unit die triggers", () => {
    it.skip("should parse 'When a friendly unit dies, draw 1.'", () => {
      const result = parseAbilities("When a friendly unit dies, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "die",
            on: expect.objectContaining({
              type: "unit",
              controller: "friendly",
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'When an enemy unit dies, draw 1.'", () => {
      const result = parseAbilities("When an enemy unit dies, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When another friendly unit dies, give me +1 :rb_might:.'", () => {
      const result = parseAbilities(
        "When another friendly unit dies, give me +1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
