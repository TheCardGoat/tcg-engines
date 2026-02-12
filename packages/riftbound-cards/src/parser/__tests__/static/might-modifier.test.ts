/**
 * Parser tests for might modifier static abilities
 *
 * Tests for parsing static abilities that modify might.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities } from "../helpers";

describe("Static: Might Modifier", () => {
  describe("self might bonus", () => {
    it.skip("should parse 'I have +1 :rb_might: for each friendly gear.'", () => {
      const result = parseAbilities("I have +1 :rb_might: for each friendly gear.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "modify-might",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'I get +1 :rb_might: for each buffed friendly unit at my battlefield.'", () => {
      const result = parseAbilities(
        "I get +1 :rb_might: for each buffed friendly unit at my battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("other units might bonus", () => {
    it.skip("should parse 'Other friendly units have +1 :rb_might: here.'", () => {
      const result = parseAbilities("Other friendly units have +1 :rb_might: here.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 1,
            type: "modify-might",
          }),
          type: "static",
        }),
      );
    });

    it.skip("should parse 'Other buffed friendly units at my battlefield have +2 :rb_might:.'", () => {
      const result = parseAbilities(
        "Other buffed friendly units at my battlefield have +2 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse 'Your Mechs have +1 :rb_might:.'", () => {
      const result = parseAbilities("Your Mechs have +1 :rb_might:.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("conditional might bonus", () => {
    it.skip("should parse 'If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might:.'", () => {
      const result = parseAbilities(
        "If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might: and [Ganking]. (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "spent-power",
          }),
          type: "static",
        }),
      );
    });
  });

  describe("equipment might bonus", () => {
    it.skip("should parse 'Each Equipment attached to me gives double its base Might bonus.'", () => {
      const result = parseAbilities(
        "Each Equipment attached to me gives double its base Might bonus.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
