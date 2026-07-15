/**
 * Parser tests for "When I move" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit moves.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Move", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When I move, draw 1.'", () => {
      const result = parseAbilities("When I move, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "move",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When I move, give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities("When I move, give me +1 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "modify-might",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("keyword granting effects", () => {
    it.skip("should parse 'When I move to a battlefield, give a friendly unit my keywords and +:rb_might: equal to my Might this turn.'", () => {
      const result = parseAbilities(
        "When I move to a battlefield, give a friendly unit my keywords and +:rb_might: equal to my Might this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("token creation effects", () => {
    it.skip("should parse 'When I move to a battlefield, play three 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities(
        "When I move to a battlefield, play three 1 :rb_might: Recruit unit tokens here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 3,
            type: "create-token",
          }),
          trigger: expect.objectContaining({
            event: "move-to-battlefield",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("ready effects", () => {
    it.skip("should parse 'The first time I move each turn, you may ready something else that's exhausted.'", () => {
      const result = parseAbilities(
        "The first time I move each turn, you may ready something else that's exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          optional: true,
          trigger: expect.objectContaining({
            event: "move",
            restrictions: expect.arrayContaining([
              expect.objectContaining({
                type: "first-time-each-turn",
              }),
            ]),
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("score effects", () => {
    it.skip("should parse 'The third time I move in a turn, you score 1 point.'", () => {
      const result = parseAbilities("The third time I move in a turn, you score 1 point.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "score",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("other unit move triggers", () => {
    it.skip("should parse 'When an opponent moves to a battlefield other than mine, draw 1.'", () => {
      const result = parseAbilities(
        "When an opponent moves to a battlefield other than mine, draw 1. (Bases are not battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When a friendly unit moves to a battlefield, give it +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When a friendly unit moves to a battlefield, give it +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
