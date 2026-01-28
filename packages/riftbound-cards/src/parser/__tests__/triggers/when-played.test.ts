/**
 * Parser tests for "When you play" triggers
 *
 * Tests for parsing triggered abilities that fire when a card is played.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Triggers } from "../helpers";

describe("Trigger: When Played", () => {
  describe("draw effects", () => {
    it.skip("should parse 'When you play me, draw 1.'", () => {
      const result = parseAbilities("When you play me, draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "play-self",
          }),
          effect: expect.objectContaining({
            type: "draw",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, draw 2.'", () => {
      const result = parseAbilities("When you play me, draw 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "draw",
            amount: 2,
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, draw 1 for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "When you play me, draw 1 for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("discard effects", () => {
    it.skip("should parse 'When you play me, discard 2.'", () => {
      const result = parseAbilities("When you play me, discard 2.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "discard",
            amount: 2,
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, discard 2, then draw 2.'", () => {
      const result = parseAbilities(
        "When you play me, discard 2, then draw 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("channel effects", () => {
    it.skip("should parse 'When you play me, channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "When you play me, channel 1 rune exhausted.",
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

    it.skip("should parse 'When you play me, channel 2 runes exhausted.'", () => {
      const result = parseAbilities(
        "When you play me, channel 2 runes exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("buff effects", () => {
    it.skip("should parse 'When you play me, buff a friendly unit.'", () => {
      const result = parseAbilities(
        "When you play me, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)",
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

    it.skip("should parse 'When you play me, buff me.'", () => {
      const result = parseAbilities(
        "When you play me, buff me. (If I don't have a buff, I get a +1 :rb_might: buff.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("might modification effects", () => {
    it.skip("should parse 'When you play me, give a unit -2 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "When you play me, give a unit -2 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: -2,
            minimum: 1,
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, give me +3 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "When you play me, give me +3 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When you play me, give enemy units -3 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "When you play me, give enemy units -3 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("token creation effects", () => {
    it.skip("should parse 'When you play me, play a 1 :rb_might: Recruit unit token here.'", () => {
      const result = parseAbilities(
        "When you play me, play a 1 :rb_might: Recruit unit token here.",
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

    it.skip("should parse 'When you play me, play a ready 3 :rb_might: Sprite unit token with [Temporary] here.'", () => {
      const result = parseAbilities(
        "When you play me, play a ready 3 :rb_might: Sprite unit token with [Temporary] here. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'When you play me, play two 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities(
        "When you play me, play two 1 :rb_might: Recruit unit tokens here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("movement effects", () => {
    it.skip("should parse 'When you play me, move a unit from a battlefield to its base.'", () => {
      const result = parseAbilities(
        "When you play me, move a unit from a battlefield to its base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "move",
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me to a battlefield, you may move an enemy unit to here.'", () => {
      const result = parseAbilities(
        "When you play me to a battlefield, you may move an enemy unit to here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
        }),
      );
    });
  });

  describe("damage effects", () => {
    it.skip("should parse 'When you play me, deal 2 to a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "When you play me, deal 2 to a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "damage",
            amount: 2,
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, deal 3 to an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "When you play me, deal 3 to an enemy unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("ready effects", () => {
    it.skip("should parse 'When you play me, ready your units.'", () => {
      const result = parseAbilities("When you play me, ready your units.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "ready",
          }),
        }),
      );
    });
  });

  describe("keyword granting effects", () => {
    it.skip("should parse 'When you play me, give a unit [Ganking] this turn.'", () => {
      const result = parseAbilities(
        "When you play me, give a unit [Ganking] this turn. (It can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Ganking",
          }),
        }),
      );
    });
  });

  describe("optional effects", () => {
    it.skip("should parse 'When you play me, you may draw 1.'", () => {
      const result = parseAbilities("When you play me, you may draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
        }),
      );
    });

    it.skip("should parse 'When you play me, you may pay :rb_energy_1: to draw 1.'", () => {
      const result = parseAbilities(
        "When you play me, you may pay :rb_energy_1: to draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("conditional effects", () => {
    it.skip("should parse 'When you play me, if you paid the additional cost, move an enemy gear to your base.'", () => {
      const result = parseAbilities(
        "When you play me, if you paid the additional cost, move an enemy gear to your base. You control it until I leave the board. If it's an Equipment, attach it to me.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
