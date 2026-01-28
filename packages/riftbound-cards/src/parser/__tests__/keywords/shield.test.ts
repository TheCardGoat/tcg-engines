/**
 * Parser tests for Shield keyword
 *
 * Tests for parsing [Shield] and [Shield N] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Targets } from "../helpers";

describe("Keyword: Shield", () => {
  describe("simple shield", () => {
    it.skip("should parse '[Shield] (+1 :rb_might: while I'm a defender.)'", () => {
      const result = parseAbilities(
        "[Shield] (+1 :rb_might: while I'm a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.shield(1)),
      );
    });
  });

  describe("shield with value", () => {
    it.skip("should parse '[Shield 2] (+2 :rb_might: while I'm a defender.)'", () => {
      const result = parseAbilities(
        "[Shield 2] (+2 :rb_might: while I'm a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.shield(2)),
      );
    });

    it.skip("should parse '[Shield 3] (+3 :rb_might: while I'm a defender.)[Tank]'", () => {
      const result = parseAbilities(
        "[Shield 3] (+3 :rb_might: while I'm a defender.)[Tank] (I must be assigned combat damage first.)When an opponent moves to a battlefield other than mine, draw 1. (Bases are not battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.shield(3)),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.tank()),
      );
    });

    it.skip("should parse '[Shield 5] (+5 :rb_might: while I'm a defender.)[Tank]'", () => {
      const result = parseAbilities(
        "[Shield 5] (+5 :rb_might: while I'm a defender.)[Tank] (I must be assigned combat damage first.)I cost :rb_energy_2::rb_rune_calm: less for each point you scored from holding this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.shield(5)),
      );
    });
  });

  describe("shield combined with other keywords", () => {
    it.skip("should parse '[Assault 2], [Shield 2]'", () => {
      const result = parseAbilities(
        "[Assault 2], [Shield 2] (+2 :rb_might: while I'm an attacker or defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.assault(2)),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.shield(2)),
      );
    });

    it.skip("should parse '[Shield] (+1 :rb_might: while I'm a defender.)[Tank]'", () => {
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
  });

  describe("conditional shield", () => {
    it.skip("should parse 'While I'm [Mighty], I have [Deflect], [Ganking], and [Shield].'", () => {
      const result = parseAbilities(
        "While I'm [Mighty], I have [Deflect], [Ganking], and [Shield]. (I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          condition: expect.objectContaining({
            type: "while-mighty",
          }),
        }),
      );
    });
  });

  describe("shield granted to others", () => {
    it.skip("should parse 'Your Mechs have [Shield].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Shield]. (+1 :rb_might: while they're defenders.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Shield",
          }),
        }),
      );
    });

    it.skip("should parse 'Other friendly units here have [Shield].'", () => {
      const result = parseAbilities(
        "[Shield] (+1 :rb_might: while I'm a defender.)[Tank] (I must be assigned combat damage first.)Other friendly units here have [Shield].",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("shield in spell effects", () => {
    it.skip("should parse 'Give a unit [Shield 3] and [Tank] this turn.'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Give a unit [Shield 3] and [Tank] this turn. (+3 :rb_might: while it's a defender. It must be assigned combat damage first.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });

    it.skip("should parse 'When you defend here, choose a unit. It gains [Shield 2] this combat.'", () => {
      const result = parseAbilities(
        "When you defend here, choose a unit. It gains [Shield 2] this combat. (+2 :rb_might: while it's a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
        }),
      );
    });
  });

  describe("shield with vision", () => {
    it.skip("should parse '[Vision][Shield]'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)[Shield]** **(+1 :rb_might: while I'm a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });
});
