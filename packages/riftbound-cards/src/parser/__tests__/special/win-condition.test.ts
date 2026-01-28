/**
 * Parser tests for win condition abilities
 *
 * Tests for parsing abilities related to winning the game.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Special: Win Condition", () => {
  describe("score effects", () => {
    it.skip("should parse 'You score 1 point.'", () => {
      const result = parseAbilities("You score 1 point.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "score",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'When I conquer, you score 1 additional point.'", () => {
      const result = parseAbilities(
        "When I conquer, you score 1 additional point.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("score conditions", () => {
    it.skip("should parse 'If you're within 2 points of winning, draw 2.'", () => {
      const result = parseAbilities(
        "If you're within 2 points of winning, draw 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          condition: expect.objectContaining({
            type: "score-within",
            points: 2,
          }),
        }),
      );
    });
  });

  describe("prevent scoring", () => {
    it.skip("should parse 'While I'm at a battlefield, opponents can't score points.'", () => {
      const result = parseAbilities(
        "While I'm at a battlefield, opponents can't score points.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("win game", () => {
    it.skip("should parse 'If you have 20 or more points, you win the game.'", () => {
      const result = parseAbilities(
        "If you have 20 or more points, you win the game.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "win-game",
          }),
        }),
      );
    });
  });
});
