/**
 * Parser tests for "At start of turn" triggers
 *
 * Tests for parsing triggered abilities that fire at the start of a turn.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: At Start of Turn", () => {
  describe("draw effects", () => {
    it.skip("should parse 'At the start of your turn, draw 1.'", () => {
      const result = parseAbilities("At the start of your turn, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "start-of-turn",
            timing: "at",
          }),
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });
  });

  describe("channel effects", () => {
    it.skip("should parse 'At the start of your turn, channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "At the start of your turn, channel 1 rune exhausted.",
      );

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

  describe("buff effects", () => {
    it.skip("should parse 'At the start of your turn, buff a friendly unit.'", () => {
      const result = parseAbilities(
        "At the start of your turn, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "buff",
          }),
        }),
      );
    });
  });

  describe("token creation effects", () => {
    it.skip("should parse 'At the start of your turn, play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities(
        "At the start of your turn, play a 1 :rb_might: Recruit unit token to your base.",
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

  describe("beginning phase triggers", () => {
    it.skip("should parse 'At the start of your Beginning Phase, draw 1.'", () => {
      const result = parseAbilities(
        "At the start of your Beginning Phase, draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "beginning-phase",
          }),
        }),
      );
    });
  });
});
