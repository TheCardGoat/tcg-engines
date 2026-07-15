/**
 * Parser tests for "When I defend" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit defends.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Defend", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When I defend, draw 1.'", () => {
      const result = parseAbilities("When I defend, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "defend",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When I defend, give me +2 :rb_might: this turn.'", () => {
      const result = parseAbilities("When I defend, give me +2 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            type: "modify-might",
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When I defend, give attacking enemy units -2 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "When I defend, give attacking enemy units -2 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("damage effects", () => {
    it.skip("should parse 'When I defend, deal 2 to an attacking enemy unit.'", () => {
      const result = parseAbilities("When I defend, deal 2 to an attacking enemy unit.");

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

  describe("keyword granting effects", () => {
    it.skip("should parse 'When you defend here, choose a unit. It gains [Shield 2] this combat.'", () => {
      const result = parseAbilities(
        "When you defend here, choose a unit. It gains [Shield 2] this combat. (+2 :rb_might: while it's a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Shield",
            type: "grant-keyword",
            value: 2,
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("reveal effects", () => {
    it.skip("should parse 'When I defend or I'm played from [Hidden], reveal the top 5 cards of your Main Deck.'", () => {
      const result = parseAbilities(
        "When I defend or I'm played from [Hidden], reveal the top 5 cards of your Main Deck. Deal 1 to an enemy unit here for each card with [Hidden], then recycle them.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("other unit defend triggers", () => {
    it.skip("should parse 'When a friendly unit defends, give it +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When a friendly unit defends, give it +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          trigger: expect.objectContaining({
            event: "defend",
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
