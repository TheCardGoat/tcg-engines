/**
 * Parser tests for "When spell" triggers
 *
 * Tests for parsing triggered abilities that fire when spells are played.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Spell", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When you play a spell, draw 1.'", () => {
      const result = parseAbilities("When you play a spell, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "play-spell",
          }),
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When you play a spell, give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When you play a spell, give me +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: 1,
          }),
        }),
      );
    });
  });

  describe("buff effects", () => {
    it.skip("should parse 'When you play a spell, buff a friendly unit.'", () => {
      const result = parseAbilities(
        "When you play a spell, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
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

  describe("first time restrictions", () => {
    it.skip("should parse 'The first time you play a spell each turn, draw 1.'", () => {
      const result = parseAbilities(
        "The first time you play a spell each turn, draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "play-spell",
            restrictions: expect.arrayContaining([
              expect.objectContaining({
                type: "first-time-each-turn",
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe("opponent spell triggers", () => {
    it.skip("should parse 'When an opponent plays a spell, draw 1.'", () => {
      const result = parseAbilities("When an opponent plays a spell, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "play-spell",
            on: "opponent",
          }),
        }),
      );
    });
  });
});
