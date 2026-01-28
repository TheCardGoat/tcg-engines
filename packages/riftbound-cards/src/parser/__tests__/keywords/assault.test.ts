/**
 * Parser tests for Assault keyword
 *
 * Tests for parsing [Assault] and [Assault N] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import {
  Abilities,
  Conditions,
  Costs,
  Effects,
  Targets,
  Triggers,
} from "../helpers";

describe("Keyword: Assault", () => {
  describe("simple assault", () => {
    it("should parse '[Assault] (+1 :rb_might: while I'm an attacker.)'", () => {
      const result = parseAbilities(
        "[Assault] (+1 :rb_might: while I'm an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.assault(1)),
      );
    });
  });

  describe("assault with value", () => {
    it("should parse '[Assault 2] (+2 :rb_might: while I'm an attacker.)'", () => {
      const result = parseAbilities(
        "[Assault 2] (+2 :rb_might: while I'm an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.assault(2)),
      );
    });

    it.skip("should parse '[Assault 3]_ (+3 :rb_might: while I'm an attacker.)_If an opponent controls a battlefield, I enter ready.When I conquer, you may pay :rb_energy_1: to return me to my owner's hand.'", () => {
      const result = parseAbilities(
        "[Assault 3]_ (+3 :rb_might: while I'm an attacker.)_If an opponent controls a battlefield, I enter ready.When I conquer, you may pay :rb_energy_1: to return me to my owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.assault(3)),
      );
    });
  });

  describe("assault combined with other keywords", () => {
    it.skip("should parse '[Assault 2], [Shield 2] (+2 :rb_might: while I'm an attacker or defender.)'", () => {
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
  });

  describe("conditional assault", () => {
    it.skip("should parse 'If you've discarded a card this turn, I have [Assault] and [Ganking].'", () => {
      const result = parseAbilities(
        "If you've discarded a card this turn, I have [Assault] and [Ganking]. (+1 :rb_might: while I'm an attacker. I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(1);
      // Should be a static ability granting keywords conditionally
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'I have [Assault] equal to the number of enemy units here.'", () => {
      const result = parseAbilities(
        "[Accelerate] _(Y_ou may pay :rb_energy_1::rb_rune_chaos: as an additional cost to have me enter ready.)I have [Assault] equal to the number of enemy units here. (+1 :rb_might: while I'm an attacker for each instance of Assault.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("assault granted to others", () => {
    it.skip("should parse 'Other friendly units here have [Assault].'", () => {
      const result = parseAbilities(
        "Other friendly units here have [Assault]. (+1 :rb_might: while they're attackers.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Assault",
          }),
        }),
      );
    });

    it.skip("should parse 'Your Equipment each give [Assault].'", () => {
      const result = parseAbilities(
        "Your Equipment each give [Assault]. (+1 :rb_might: while equipped unit is an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });
  });

  describe("assault in spell effects", () => {
    it.skip("should parse '[Action] Give a unit [Assault 3] this turn.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give a unit [Assault 3] this turn. (+3 :rb_might: while it's an attacker.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Assault",
            value: 3,
          }),
        }),
      );
    });
  });
});
