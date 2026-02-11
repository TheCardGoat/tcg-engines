/**
 * Parser tests for "When discard" triggers
 *
 * Tests for parsing triggered abilities that fire when cards are discarded.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Discard", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When you discard a card, draw 1.'", () => {
      const result = parseAbilities("When you discard a card, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "discard",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When you discard a card, give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities("When you discard a card, give me +1 :rb_might: this turn.");

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

  describe("buff effects", () => {
    it.skip("should parse 'When you discard a card, buff a friendly unit.'", () => {
      const result = parseAbilities(
        "When you discard a card, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
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

  describe("first time restrictions", () => {
    it.skip("should parse 'The first time you discard a card each turn, draw 1.'", () => {
      const result = parseAbilities("The first time you discard a card each turn, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          trigger: expect.objectContaining({
            event: "discard",
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
});
