/**
 * Parser tests for Mech tribal abilities
 *
 * Tests for parsing abilities that reference Mechs.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets } from "../helpers";

describe("Tribal: Mech", () => {
  describe("mech keyword grants", () => {
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
            target: expect.objectContaining({
              filter: expect.objectContaining({
                tag: "Mech",
              }),
            }),
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

  describe("mech might bonus", () => {
    it.skip("should parse 'Your Mechs have +1 :rb_might:.'", () => {
      const result = parseAbilities("Your Mechs have +1 :rb_might:.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Give your Mechs +1 :rb_might: this turn.'", () => {
      const result = parseAbilities("Give your Mechs +1 :rb_might: this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("mech conditional", () => {
    it.skip("should parse 'I enter ready if you control another Mech.'", () => {
      const result = parseAbilities("I enter ready if you control another Mech.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            target: expect.objectContaining({
              filter: expect.objectContaining({
                tag: "Mech",
              }),
            }),
            type: "control",
          }),
          type: "static",
        }),
      );
    });
  });

  describe("mech tokens", () => {
    it.skip("should parse 'Play two 3 :rb_might: Mech unit tokens to your base.'", () => {
      const result = parseAbilities("Play two 3 :rb_might: Mech unit tokens to your base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            token: expect.objectContaining({
              name: "Mech",
              type: "unit",
              might: 3,
            }),
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });
  });
});
