/**
 * Parser tests for keyword granting static abilities
 *
 * Tests for parsing static abilities that grant keywords.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities } from "../helpers";

describe("Static: Keyword Grant", () => {
  describe("grant to other units", () => {
    it.skip("should parse 'Other friendly units here have [Assault].'", () => {
      const result = parseAbilities(
        "Other friendly units here have [Assault]. (+1 :rb_might: while they're attackers.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Assault",
            type: "grant-keyword",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'Other friendly units here have [Shield].'", () => {
      const result = parseAbilities(
        "Other friendly units here have [Shield]. (+1 :rb_might: while they're defenders.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Other friendly units have [Vision].'", () => {
      const result = parseAbilities(
        "Other friendly units have [Vision]. (When you play us, look at the top card of your Main Deck. You may recycle it.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("grant to specific types", () => {
    it.skip("should parse 'Your Mechs have [Shield].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Shield]. (+1 :rb_might: while they're defenders.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Shield",
            type: "grant-keyword",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'Your Mechs have [Vision].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Vision]. (When you play us, look at the top card of your Main Deck. You may recycle it.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Your Mechs have [Deflect] and [Ganking].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Deflect] and [Ganking]. (Opponents must pay :rb_rune_rainbow: to choose us with a spell or ability. We can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("grant to equipment", () => {
    it.skip("should parse 'Each Equipment in your hand has [Quick-Draw].'", () => {
      const result = parseAbilities(
        "Each Equipment in your hand has [Quick-Draw]. (It gains [Reaction]. When you play it, attach it to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Quick-Draw",
            type: "grant-keyword",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'Your Equipment each give [Assault].'", () => {
      const result = parseAbilities(
        "Your Equipment each give [Assault]. (+1 :rb_might: while equipped unit is an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("conditional keyword grant", () => {
    it.skip("should parse 'While I'm [Mighty], I have [Deflect], [Ganking], and [Shield].'", () => {
      const result = parseAbilities(
        "While I'm [Mighty], I have [Deflect], [Ganking], and [Shield]. (I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-mighty",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'While I'm buffed, I have [Ganking].'", () => {
      const result = parseAbilities(
        "While I'm buffed, I have [Ganking]. (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-buffed",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'If you've discarded a card this turn, I have [Assault] and [Ganking].'", () => {
      const result = parseAbilities(
        "If you've discarded a card this turn, I have [Assault] and [Ganking]. (+1 :rb_might: while I'm an attacker. I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("grant to location", () => {
    it.skip("should parse 'Units here have [Ganking].'", () => {
      const result = parseAbilities(
        "Units here have [Ganking]. (They can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Friendly units have [Deflect].'", () => {
      const result = parseAbilities(
        "Friendly units have [Deflect]. (Opponents must pay :rb_rune_rainbow: to choose them with a spell or ability.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
