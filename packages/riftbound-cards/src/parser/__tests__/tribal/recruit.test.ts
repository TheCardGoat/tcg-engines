/**
 * Parser tests for Recruit tribal abilities
 *
 * Tests for parsing abilities that reference Recruits.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets, Tokens } from "../helpers";

describe("Tribal: Recruit", () => {
  describe("recruit tokens", () => {
    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            token: expect.objectContaining({
              name: "Recruit",
              type: "unit",
              might: 1,
            }),
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token here.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token to your base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Play two 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities("Play two 1 :rb_might: Recruit unit tokens here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 2,
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Play three 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities("Play three 1 :rb_might: Recruit unit tokens here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 3,
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Play three 1 :rb_might: Recruit unit tokens into your base.'", () => {
      const result = parseAbilities("Play three 1 :rb_might: Recruit unit tokens into your base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Play four 1 :rb_might: Recruit unit tokens.'", () => {
      const result = parseAbilities(
        "Play four 1 :rb_might: Recruit unit tokens. (They can be played to your base or to battlefields you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 4,
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });
  });
});
