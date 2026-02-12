/**
 * Parser tests for Poro tribal abilities
 *
 * Tests for parsing abilities that reference Poros.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Targets } from "../helpers";

describe("Tribal: Poro", () => {
  describe("poro keyword grants", () => {
    it.skip("should parse 'Your Poros have [Shield].'", () => {
      const result = parseAbilities(
        "Your Poros have [Shield]. (+1 :rb_might: while they're defenders.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            keyword: "Shield",
            target: expect.objectContaining({
              filter: expect.objectContaining({
                tag: "Poro",
              }),
            }),
            type: "grant-keyword",
          }),
          type: "static",
        }),
      );
    });
  });

  describe("poro might bonus", () => {
    it.skip("should parse 'Your Poros have +1 :rb_might:.'", () => {
      const result = parseAbilities("Your Poros have +1 :rb_might:.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("poro conditional", () => {
    it.skip("should parse 'I enter ready if you control another Poro.'", () => {
      const result = parseAbilities("I enter ready if you control another Poro.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
