/**
 * Parser tests for token creation effects
 *
 * Tests for parsing abilities that create tokens.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Tokens } from "../helpers";

describe("Effect: Token Creation", () => {
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

    it.skip("should parse 'Play three 1 :rb_might: Recruit unit tokens.'", () => {
      const result = parseAbilities("Play three 1 :rb_might: Recruit unit tokens.");

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

    it.skip("should parse 'Play four 1 :rb_might: Recruit unit tokens.'", () => {
      const result = parseAbilities("Play four 1 :rb_might: Recruit unit tokens.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("sand soldier tokens", () => {
    it.skip("should parse 'Play a 2 :rb_might: Sand Soldier unit token.'", () => {
      const result = parseAbilities("Play a 2 :rb_might: Sand Soldier unit token.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            token: expect.objectContaining({
              name: "Sand Soldier",
              type: "unit",
              might: 2,
            }),
            type: "create-token",
          }),
          type: "spell",
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

  describe("sprite tokens", () => {
    it.skip("should parse 'Play a ready 3 :rb_might: Sprite unit token with [Temporary].'", () => {
      const result = parseAbilities(
        "Play a ready 3 :rb_might: Sprite unit token with [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            ready: true,
            token: expect.objectContaining({
              name: "Sprite",
              type: "unit",
              might: 3,
              keywords: expect.arrayContaining(["Temporary"]),
            }),
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });
  });

  describe("gold tokens", () => {
    it.skip("should parse 'Play a Gold gear token exhausted.'", () => {
      const result = parseAbilities("Play a Gold gear token exhausted.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            token: expect.objectContaining({
              name: "Gold",
              type: "gear",
            }),
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });
  });

  describe("token location", () => {
    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token here.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            location: "here",
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });

    it.skip("should parse 'Play a 1 :rb_might: Recruit unit token to your base.'", () => {
      const result = parseAbilities("Play a 1 :rb_might: Recruit unit token to your base.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            location: "base",
            type: "create-token",
          }),
          type: "spell",
        }),
      );
    });
  });
});
