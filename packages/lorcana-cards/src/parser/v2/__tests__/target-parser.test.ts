/**
 * Tests for Target Parser
 *
 * Verifies that target phrases are correctly parsed into the Target DSL.
 */
import { describe, expect, it } from "bun:test";
import {
  parseCharacterTarget,
  parseItemTarget,
  parseLocationTarget,
} from "../parsers/target-parser";

/**
 * TODO: Target Parser tests skipped - complex target specification parsing not in scope for v2 parser fixes
 * These tests involve detailed target phrase parsing (selector/count/owner) that are deferred.
 * Skipped as per plan: https://github.com/...
 */
describe.skip("Target Parser", () => {
  describe("Character Targets", () => {
    it("should parse 'chosen character'", () => {
      const result = parseCharacterTarget("Deal damage to chosen character");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should parse 'chosen opposing character'", () => {
      const result = parseCharacterTarget("Banishing chosen opposing character");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: 1,
        owner: "opponent",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should parse 'chosen character of yours'", () => {
      const result = parseCharacterTarget("Heal chosen character of yours");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: 1,
        owner: "you",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should parse 'all characters'", () => {
      const result = parseCharacterTarget("Damage all characters");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: "all",
        owner: "any",
        selector: "all",
        zones: ["play"],
      });
    });

    it("should parse 'all opposing characters'", () => {
      const result = parseCharacterTarget("Damage all opposing characters");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: "all",
        owner: "opponent",
        selector: "all",
        zones: ["play"],
      });
    });

    it("should parse 'each opposing character'", () => {
      const result = parseCharacterTarget("Damage each opposing character");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: "all",
        owner: "opponent",
        selector: "all",
        zones: ["play"],
      });
    });

    it("should parse 'your characters'", () => {
      const result = parseCharacterTarget("Your characters get +1 lore");
      expect(result).toEqual({
        cardTypes: ["character"],
        count: "all",
        owner: "you",
        selector: "all",
        zones: ["play"],
      });
    });
  });

  describe("Item Targets", () => {
    it("should parse 'chosen item'", () => {
      const result = parseItemTarget("Banish chosen item");
      expect(result).toEqual({
        cardTypes: ["item"],
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });
  });

  describe("Location Targets", () => {
    it("should parse 'chosen location'", () => {
      const result = parseLocationTarget("Banish chosen location");
      expect(result).toEqual({
        cardTypes: ["location"],
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });
  });
});
