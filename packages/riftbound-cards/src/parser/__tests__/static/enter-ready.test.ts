/**
 * Parser tests for enter ready static abilities
 *
 * Tests for parsing static abilities that make units enter ready.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities } from "../helpers";

describe("Static: Enter Ready", () => {
  describe("self enter ready", () => {
    it.skip("should parse 'I enter ready.'", () => {
      const result = parseAbilities("I enter ready.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'I enter ready if you control another Mech.'", () => {
      const result = parseAbilities(
        "I enter ready if you control another Mech.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          condition: expect.objectContaining({
            type: "control",
          }),
        }),
      );
    });

    it.skip("should parse 'I enter ready if you have two or more other units in your base.'", () => {
      const result = parseAbilities(
        "I enter ready if you have two or more other units in your base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'If an opponent controls a battlefield, I enter ready.'", () => {
      const result = parseAbilities(
        "If an opponent controls a battlefield, I enter ready.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          condition: expect.objectContaining({
            type: "opponent-controls",
          }),
        }),
      );
    });
  });

  describe("other units enter ready", () => {
    it.skip("should parse 'Units you play this turn enter ready.'", () => {
      const result = parseAbilities("Units you play this turn enter ready.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Friendly units enter ready this turn.'", () => {
      const result = parseAbilities("Friendly units enter ready this turn.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'The next unit you play this turn enters ready.'", () => {
      const result = parseAbilities(
        "The next unit you play this turn enters ready.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
