/**
 * Parser tests for restriction static abilities
 *
 * Tests for parsing static abilities that restrict actions.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities } from "../helpers";

describe("Static: Restriction", () => {
  describe("scoring restrictions", () => {
    it.skip("should parse 'While I'm at a battlefield, opponents can't score points.'", () => {
      const result = parseAbilities("While I'm at a battlefield, opponents can't score points.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-at-battlefield",
          }),
          type: "static",
        }),
      );
    });
  });

  describe("play restrictions", () => {
    it.skip("should parse 'You may play me to an occupied enemy battlefield.'", () => {
      const result = parseAbilities("You may play me to an occupied enemy battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'You may play me to an open battlefield.'", () => {
      const result = parseAbilities("You may play me to an open battlefield.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("damage restrictions", () => {
    it.skip("should parse 'If I have moved twice this turn, I don't take damage.'", () => {
      const result = parseAbilities("If I have moved twice this turn, I don't take damage.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("use restrictions", () => {
    it.skip("should parse 'Use only if you've played an Equipment this turn.'", () => {
      const result = parseAbilities(
        ":rb_energy_1:, :rb_exhaust:: Play a 2 :rb_might: Sand Soldier unit token to your base. Use only if you've played an Equipment this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          restrictions: expect.arrayContaining([
            expect.objectContaining({
              type: "played-equipment-this-turn",
            }),
          ]),
          type: "activated",
        }),
      );
    });
  });
});
