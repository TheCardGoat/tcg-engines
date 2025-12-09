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
  parsePlayerTarget,
} from "../parsers/target-parser";

describe("Target Parser", () => {
  describe("Character Targets", () => {
    it("should parse 'chosen character'", () => {
      const result = parseCharacterTarget("Deal damage to chosen character");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: 1,
        controller: "any",
        zone: ["play"],
      });
    });

    it("should parse 'chosen opposing character'", () => {
      const result = parseCharacterTarget(
        "Banishing chosen opposing character",
      );
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: 1,
        controller: "opponent",
        zone: ["play"],
      });
    });

    it("should parse 'chosen character of yours'", () => {
      const result = parseCharacterTarget("Heal chosen character of yours");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: 1,
        controller: "you",
        zone: ["play"],
      });
    });

    it("should parse 'all characters'", () => {
      const result = parseCharacterTarget("Damage all characters");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: "all",
        controller: "any",
        zone: ["play"],
      });
    });

    it("should parse 'all opposing characters'", () => {
      const result = parseCharacterTarget("Damage all opposing characters");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: "all",
        controller: "opponent",
        zone: ["play"],
      });
    });

    it("should parse 'each opposing character'", () => {
      const result = parseCharacterTarget("Damage each opposing character");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: "all",
        controller: "opponent",
        zone: ["play"],
      });
    });

    it("should parse 'your characters'", () => {
      const result = parseCharacterTarget("Your characters get +1 lore");
      expect(result).toEqual({
        type: "query",
        cardType: "character",
        count: "all",
        controller: "you",
        zone: ["play"],
      });
    });
  });

  describe("Item Targets", () => {
    it("should parse 'chosen item'", () => {
      const result = parseItemTarget("Banish chosen item");
      expect(result).toEqual({
        type: "query",
        cardType: "item",
        count: 1,
        controller: "any",
        zone: ["play"],
      });
    });
  });

  describe("Location Targets", () => {
    it("should parse 'chosen location'", () => {
      const result = parseLocationTarget("Banish chosen location");
      expect(result).toEqual({
        type: "query",
        cardType: "location",
        count: 1,
        controller: "any",
        zone: ["play"],
      });
    });
  });
});
