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
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "die",
          }),
          type: "triggered",
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

  describe("token creation effects", () => {
    it.skip("should parse 'When I die, play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities(
        "When I die, play a 1 :rb_might: Recruit unit token to your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "create-token",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("damage effects", () => {
    it.skip("should parse 'When I die, deal 2 to all enemy units at my battlefield.'", () => {
      const result = parseAbilities("When I die, deal 2 to all enemy units at my battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            type: "damage",
          }),
          type: "triggered",
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
          effect: expect.objectContaining({
            type: "recycle",
          }),
          type: "triggered",
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
          trigger: expect.objectContaining({
            event: "die",
            on: expect.objectContaining({
              controller: "friendly",
              type: "unit",
            }),
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When an enemy unit dies, draw 1.'", () => {
      const result = parseAbilities("When an enemy unit dies, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When another friendly unit dies, give me +1 :rb_might:.'", () => {
      const result = parseAbilities("When another friendly unit dies, give me +1 :rb_might:.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
