/**
 * Parser tests for Tank keyword
 *
 * Tests for parsing [Tank] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Triggers } from "../helpers";

describe("Keyword: Tank", () => {
  describe("simple tank", () => {
    it.skip("should parse '[Tank] (I must be assigned combat damage first.)'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
    });
  });

  describe("tank with triggered abilities", () => {
    it.skip("should parse '[Tank] When you play me, draw 1.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)When you play me, draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
      expect(result.abilities?.[1]).toEqual(
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

    it.skip("should parse '[Tank] When you play me, channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)When you play me, channel 1 rune exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
      expect(result.abilities?.[1]).toEqual(
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

    it.skip("should parse '[Tank] When you play me, move a unit from a battlefield to its base.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)When you play me, move a unit from a battlefield to its base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "move",
          }),
        }),
      );
    });
  });

  describe("tank with static abilities", () => {
    it.skip("should parse '[Tank] I get +1 :rb_might: for each buffed friendly unit at my battlefield.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)I get +1 :rb_might: for each buffed friendly unit at my battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse '[Tank] I enter ready if you have two or more other units in your base.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)I enter ready if you have two or more other units in your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("tank combined with shield", () => {
    it.skip("should parse '[Shield][Tank]'", () => {
      const result = parseAbilities(
        "[Shield] (+1 :rb_might: while I'm a defender.)[Tank] (I must be assigned combat damage first.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.shield(1)),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
    });

    it.skip("should parse '[Shield 2][Tank]'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve, including to a battlefield you control.)[Shield 2] (+2 :rb_might: while I'm a defender.)[Tank] (I must be assigned combat damage first.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("tank with multiple triggers", () => {
    it.skip("should parse '[Tank] When you play me to a battlefield, you may move an enemy unit to here. When I hold, return me to my owner's hand.'", () => {
      const result = parseAbilities(
        "[Tank] (I must be assigned combat damage first.)When you play me to a battlefield, you may move an enemy unit to here.When I hold, return me to my owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
        }),
      );
      expect(result.abilities?.[2]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "hold",
          }),
        }),
      );
    });
  });
});
