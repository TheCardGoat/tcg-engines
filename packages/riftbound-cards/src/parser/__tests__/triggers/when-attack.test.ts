/**
 * Parser tests for "When I attack" triggers
 *
 * Tests for parsing triggered abilities that fire when a unit attacks.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Attack", () => {
  describe("damage effects", () => {
    it.skip("should parse 'When I attack, deal 5 damage split among any number of enemy units here.'", () => {
      const result = parseAbilities(
        "When I attack, deal 5 damage split among any number of enemy units here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 5,
            split: true,
            type: "damage",
          }),
          trigger: expect.objectContaining({
            event: "attack",
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When I attack, deal 2 to an enemy unit here.'", () => {
      const result = parseAbilities("When I attack, deal 2 to an enemy unit here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When I attack, deal 3 to an enemy unit here.'", () => {
      const result = parseAbilities("When I attack, deal 3 to an enemy unit here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("draw effects", () => {
    it.skip("should parse 'When I attack, draw 1.'", () => {
      const result = parseAbilities("When I attack, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "draw",
          }),
          trigger: expect.objectContaining({
            event: "attack",
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When I attack, draw 1 for each other friendly unit here.'", () => {
      const result = parseAbilities("When I attack, draw 1 for each other friendly unit here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("movement effects", () => {
    it.skip("should parse 'When I attack, you may move any number of your token units to this battlefield.'", () => {
      const result = parseAbilities(
        "When I attack, you may move any number of your token units to this battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "move",
          }),
          optional: true,
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When I attack, you may move a friendly unit from your base to here.'", () => {
      const result = parseAbilities(
        "When I attack, you may move a friendly unit from your base to here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When I attack, give me +2 :rb_might: this turn.'", () => {
      const result = parseAbilities("When I attack, give me +2 :rb_might: this turn.");

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

    it.skip("should parse 'When I attack, give enemy units here -1 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "When I attack, give enemy units here -1 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("stun effects", () => {
    it.skip("should parse 'When I attack, stun an enemy unit here.'", () => {
      const result = parseAbilities(
        "When I attack, stun an enemy unit here. (It doesn't deal combat damage this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "stun",
          }),
          type: "triggered",
        }),
      );
    });
  });

  describe("buff effects", () => {
    it.skip("should parse 'When I attack, buff me.'", () => {
      const result = parseAbilities(
        "When I attack, buff me. (If I don't have a buff, I get a +1 :rb_might: buff.)",
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

  describe("token creation effects", () => {
    it.skip("should parse 'When I attack, play a 1 :rb_might: Recruit unit token here.'", () => {
      const result = parseAbilities("When I attack, play a 1 :rb_might: Recruit unit token here.");

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

  describe("conditional effects", () => {
    it.skip("should parse 'When I attack, if I'm alone, give me +3 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When I attack, if I'm alone, give me +3 :rb_might: this turn. (I'm alone if there are no other friendly units here.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-alone",
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When I attack, if I'm [Mighty], deal 3 to an enemy unit here.'", () => {
      const result = parseAbilities(
        "When I attack, if I'm [Mighty], deal 3 to an enemy unit here. (I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("other unit attack triggers", () => {
    it.skip("should parse 'When a friendly unit attacks, give it +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When a friendly unit attacks, give it +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          trigger: expect.objectContaining({
            event: "attack",
            on: expect.objectContaining({
              controller: "friendly",
              type: "unit",
            }),
          }),
          type: "triggered",
        }),
      );
    });

    it.skip("should parse 'When you attack here, draw 1.'", () => {
      const result = parseAbilities("When you attack here, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
