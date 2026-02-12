/**
 * Parser tests for "At end of turn" triggers
 *
 * Tests for parsing triggered abilities that fire at the end of a turn.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: At End of Turn", () => {
  describe("draw effects", () => {
    it.skip("should parse 'At the end of your turn, draw 1.'", () => {
      const result = parseAbilities("At the end of your turn, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "end-of-turn",
            timing: "at",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("recall effects", () => {
    it.skip("should parse 'At the end of your turn, recall me.'", () => {
      const result = parseAbilities(
        "At the end of your turn, recall me. (Send me to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "recall",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("lose control effects", () => {
    it.skip("should parse 'Lose control of that unit and recall it at end of turn.'", () => {
      const result = parseAbilities(
        "Lose control of that unit and recall it at end of turn. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("kill effects", () => {
    it.skip("should parse 'At the end of your turn, kill me.'", () => {
      const result = parseAbilities("At the end of your turn, kill me.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "kill",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("conditional effects", () => {
    it.skip("should parse 'At the end of your turn, if I'm at a battlefield, draw 1.'", () => {
      const result = parseAbilities("At the end of your turn, if I'm at a battlefield, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-at-battlefield",
          }),
          type: "triggered",
        }),
      );
    });
  });
});
