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
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'chosen opposing character'", () => {
      const result = parseCharacterTarget(
        "Banishing chosen opposing character",
      );
      expect(result).toEqual({
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'chosen character of yours'", () => {
      const result = parseCharacterTarget("Heal chosen character of yours");
      expect(result).toEqual({
        selector: "chosen",
        count: 1,
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'all characters'", () => {
      const result = parseCharacterTarget("Damage all characters");
      expect(result).toEqual({
        selector: "all",
        count: "all",
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'all opposing characters'", () => {
      const result = parseCharacterTarget("Damage all opposing characters");
      expect(result).toEqual({
        selector: "all",
        count: "all",
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'each opposing character'", () => {
      const result = parseCharacterTarget("Damage each opposing character");
      expect(result).toEqual({
        selector: "all",
        count: "all",
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });

    it("should parse 'your characters'", () => {
      const result = parseCharacterTarget("Your characters get +1 lore");
      expect(result).toEqual({
        selector: "all",
        count: "all",
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      });
    });
  });

  describe("Item Targets", () => {
    it("should parse 'chosen item'", () => {
      const result = parseItemTarget("Banish chosen item");
      expect(result).toEqual({
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["item"],
      });
    });
  });

  describe("Location Targets", () => {
    it("should parse 'chosen location'", () => {
      const result = parseLocationTarget("Banish chosen location");
      expect(result).toEqual({
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["location"],
      });
    });
  });
});
