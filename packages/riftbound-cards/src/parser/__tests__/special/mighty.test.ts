/**
 * Parser tests for Mighty condition abilities
 *
 * Tests for parsing abilities that reference the Mighty condition.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Conditions } from "../helpers";

describe("Special: Mighty", () => {
  describe("while mighty condition", () => {
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
  });

  describe("if mighty condition", () => {
    it.skip("should parse 'If I was [Mighty], draw 2.'", () => {
      const result = parseAbilities(
        "[Deathknell] — If I was [Mighty], draw 2. (When I die, get the effect. I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-mighty",
          }),
          keyword: "Deathknell",
          type: "keyword",
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

  describe("mighty count", () => {
    it.skip("should parse 'Draw 1 for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "Draw 1 for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'I cost :rb_energy_2: less for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "I cost :rb_energy_2: less for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("become mighty trigger", () => {
    it.skip("should parse 'When I become [Mighty], draw 1.'", () => {
      const result = parseAbilities(
        "When I become [Mighty], draw 1. (I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          trigger: expect.objectContaining({
            event: "become-mighty",
          }),
          type: "triggered",
        }),
      );
    });
  });
});
