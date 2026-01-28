/**
 * Parser tests for Dragon tribal abilities
 *
 * Tests for parsing abilities that reference Dragons.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets } from "../helpers";

describe("Tribal: Dragon", () => {
  describe("dragon keyword grants", () => {
    it.skip("should parse 'Your Dragons have [Assault].'", () => {
      const result = parseAbilities(
        "Your Dragons have [Assault]. (+1 :rb_might: while they're attackers.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Assault",
            target: expect.objectContaining({
              filter: expect.objectContaining({
                tag: "Dragon",
              }),
            }),
          }),
        }),
      );
    });
  });

  describe("dragon might bonus", () => {
    it.skip("should parse 'Your Dragons have +1 :rb_might:.'", () => {
      const result = parseAbilities("Your Dragons have +1 :rb_might:.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("dragon conditional", () => {
    it.skip("should parse 'I enter ready if you control another Dragon.'", () => {
      const result = parseAbilities(
        "I enter ready if you control another Dragon.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
