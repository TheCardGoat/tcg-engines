/**
 * Parser tests for "When I conquer" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit conquers.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Conquer", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When I conquer, draw 1.'", () => {
      const result = parseAbilities("When I conquer, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "conquer",
          }),
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'When I conquer, draw 1 or channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "When I conquer, draw 1 or channel 1 rune exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "choice",
          }),
        }),
      );
    });
  });

  describe("channel effects", () => {
    it.skip("should parse 'When I conquer, channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "When I conquer, channel 1 rune exhausted.",
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

  describe("damage effects", () => {
    it.skip("should parse 'When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.'", () => {
      const result = parseAbilities(
        "When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "damage",
          }),
        }),
      );
    });
  });

  describe("ready effects", () => {
    it.skip("should parse 'The first time I conquer each turn, ready me.'", () => {
      const result = parseAbilities(
        "The first time I conquer each turn, ready me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "conquer",
            restrictions: expect.arrayContaining([
              expect.objectContaining({
                type: "first-time-each-turn",
              }),
            ]),
          }),
          effect: expect.objectContaining({
            type: "ready",
          }),
        }),
      );
    });
  });

  describe("return to hand effects", () => {
    it.skip("should parse 'When I conquer, you may pay :rb_energy_1: to return me to my owner's hand.'", () => {
      const result = parseAbilities(
        "When I conquer, you may pay :rb_energy_1: to return me to my owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
          effect: expect.objectContaining({
            type: "return-to-hand",
          }),
        }),
      );
    });
  });

  describe("play from trash effects", () => {
    it.skip("should parse 'When I conquer, you may play a spell from your trash with Energy cost less than your points without paying its Energy cost.'", () => {
      const result = parseAbilities(
        "When I conquer, you may play a spell from your trash with Energy cost less than your points without paying its Energy cost. Then recycle it. (You must still pay its Power cost.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
          effect: expect.objectContaining({
            type: "play",
          }),
        }),
      );
    });
  });

  describe("score effects", () => {
    it.skip("should parse 'When I conquer, you score 1 additional point.'", () => {
      const result = parseAbilities(
        "When I conquer, you score 1 additional point.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "score",
            amount: 1,
          }),
        }),
      );
    });
  });

  describe("other unit conquer triggers", () => {
    it.skip("should parse 'When a friendly unit conquers, draw 1.'", () => {
      const result = parseAbilities("When a friendly unit conquers, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "conquer",
            on: expect.objectContaining({
              type: "unit",
              controller: "friendly",
            }),
          }),
        }),
      );
    });

    it.skip("should parse 'When you conquer here, draw 1.'", () => {
      const result = parseAbilities("When you conquer here, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
