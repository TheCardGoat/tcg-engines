/**
 * Parser tests for battlefield location abilities
 *
 * Tests for parsing abilities that reference battlefields.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets } from "../helpers";

describe("Location: Battlefield", () => {
  describe("at battlefield", () => {
    it.skip("should parse 'Deal 3 to a unit at a battlefield.'", () => {
      const result = parseAbilities("Deal 3 to a unit at a battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            target: expect.objectContaining({
              location: "battlefield",
            }),
            type: "damage",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Kill a unit at a battlefield.'", () => {
      const result = parseAbilities("Kill a unit at a battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("at my battlefield", () => {
    it.skip("should parse 'Deal 4 to all units at my battlefield.'", () => {
      const result = parseAbilities("Deal 4 to all units at my battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'I get +1 :rb_might: for each buffed friendly unit at my battlefield.'", () => {
      const result = parseAbilities(
        "I get +1 :rb_might: for each buffed friendly unit at my battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("here (current battlefield)", () => {
    it.skip("should parse 'Other friendly units here have [Assault].'", () => {
      const result = parseAbilities(
        "Other friendly units here have [Assault]. (+1 :rb_might: while they're attackers.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            target: expect.objectContaining({
              location: "here",
            }),
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token here.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("open battlefield", () => {
    it.skip("should parse 'When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.'", () => {
      const result = parseAbilities(
        "When I conquer an open battlefield, deal damage equal to my Might to an enemy unit in a base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'You may play me to an open battlefield.'", () => {
      const result = parseAbilities("You may play me to an open battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("enemy battlefield", () => {
    it.skip("should parse 'You may play me to an occupied enemy battlefield.'", () => {
      const result = parseAbilities("You may play me to an occupied enemy battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("control battlefield", () => {
    it.skip("should parse 'While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.'", () => {
      const result = parseAbilities(
        "While you control this battlefield, friendly [Repeat] costs cost :rb_energy_1: less.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
