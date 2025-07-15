// Unit tests for Target Mapping System

import { describe, expect, it } from "@jest/globals";
import {
  chosenCharacter,
  chosenCharacterOfYours,
  chosenItem,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/target";
import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  combineTargets,
  createCustomCardTarget,
  createCustomPlayerTarget,
  generateTargetFilters,
  parseTargetFromText,
  TARGET_PATTERN_MAP,
  validateTarget,
} from "../target-mapper";

describe("Target Mapper", () => {
  describe("TARGET_PATTERN_MAP", () => {
    it("should contain common target patterns", () => {
      expect(TARGET_PATTERN_MAP["chosen character"]).toEqual(chosenCharacter);
      expect(TARGET_PATTERN_MAP["chosen character of yours"]).toEqual(
        chosenCharacterOfYours,
      );
      expect(TARGET_PATTERN_MAP["chosen opposing character"]).toEqual(
        chosenOpposingCharacter,
      );
      expect(TARGET_PATTERN_MAP["chosen item"]).toEqual(chosenItem);
      expect(TARGET_PATTERN_MAP["you"]).toEqual(self);
      expect(TARGET_PATTERN_MAP["each opponent"]).toEqual(opponent);
    });
  });

  describe("createCustomCardTarget", () => {
    it("should create a basic card target", () => {
      const target = createCustomCardTarget("character");

      expect(target).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      });
    });

    it("should create a card target with owner filter", () => {
      const target = createCustomCardTarget("character", "play", "self");

      expect(target).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      });
    });

    it("should create a card target with status filter", () => {
      const target = createCustomCardTarget(
        "character",
        "play",
        "self",
        "damaged",
      );

      expect(target).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "status", value: "damaged" },
        ],
      });
    });

    it("should create a card target with all value", () => {
      const target = createCustomCardTarget(
        "character",
        "play",
        "self",
        undefined,
        "all",
      );

      expect(target).toEqual({
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      });
    });

    it("should create a card target with excludeSelf", () => {
      const target = createCustomCardTarget(
        "character",
        "play",
        "self",
        undefined,
        1,
        true,
      );

      expect(target).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
        excludeSelf: true,
      });
    });

    it("should create a card target with multiple types", () => {
      const target = createCustomCardTarget(["character", "item"]);

      expect(target).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: ["character", "item"] },
          { filter: "zone", value: "play" },
        ],
      });
    });
  });

  describe("createCustomPlayerTarget", () => {
    it("should create a self player target by default", () => {
      const target = createCustomPlayerTarget();

      expect(target).toEqual({
        type: "player",
        value: "self",
      });
    });

    it("should create an opponent player target", () => {
      const target = createCustomPlayerTarget("opponent");

      expect(target).toEqual({
        type: "player",
        value: "opponent",
      });
    });

    it("should create an all players target", () => {
      const target = createCustomPlayerTarget("all");

      expect(target).toEqual({
        type: "player",
        value: "all",
      });
    });
  });

  describe("parseTargetFromText", () => {
    it("should parse direct pattern matches", () => {
      expect(parseTargetFromText("chosen character")).toEqual(chosenCharacter);
      expect(parseTargetFromText("chosen character of yours")).toEqual(
        chosenCharacterOfYours,
      );
      expect(parseTargetFromText("you")).toEqual(self);
      expect(parseTargetFromText("each opponent")).toEqual(opponent);
    });

    it("should handle case insensitive matching", () => {
      expect(parseTargetFromText("CHOSEN CHARACTER")).toEqual(chosenCharacter);
      expect(parseTargetFromText("Chosen Character Of Yours")).toEqual(
        chosenCharacterOfYours,
      );
    });

    it("should parse 'your X' patterns", () => {
      const yourCharacters = parseTargetFromText("your characters");
      expect(yourCharacters).toEqual({
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      });

      const yourItems = parseTargetFromText("your items");
      expect(yourItems).toEqual({
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "item" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
        ],
      });
    });

    it("should parse zone-specific patterns", () => {
      const fromHand = parseTargetFromText("from your hand");
      expect(fromHand).toEqual({
        type: "card",
        value: 1,
        filters: [
          {
            filter: "type",
            value: ["character", "item", "location", "action"],
          },
          { filter: "zone", value: "hand" },
          { filter: "owner", value: "self" },
        ],
      });

      const fromDiscard = parseTargetFromText("from your discard");
      expect(fromDiscard).toEqual({
        type: "card",
        value: 1,
        filters: [
          {
            filter: "type",
            value: ["character", "item", "location", "action"],
          },
          { filter: "zone", value: "discard" },
          { filter: "owner", value: "self" },
        ],
      });
    });

    it("should parse status-based patterns", () => {
      const damagedCharacter = parseTargetFromText("damaged character");
      expect(damagedCharacter).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "status", value: "damaged" },
        ],
      });

      const yourDamagedCharacter = parseTargetFromText(
        "your damaged character",
      );
      expect(yourDamagedCharacter).toEqual({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "status", value: "damaged" },
        ],
      });
    });

    it("should parse 'each X' patterns", () => {
      const eachOpponent = parseTargetFromText("each opponent");
      expect(eachOpponent).toEqual(opponent);

      const eachPlayer = parseTargetFromText("each player");
      expect(eachPlayer).toEqual({
        type: "player",
        value: "all",
      });

      const eachCharacter = parseTargetFromText("each character");
      expect(eachCharacter).toEqual({
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      });
    });

    it("should return null for unknown patterns", () => {
      expect(parseTargetFromText("unknown pattern")).toBeNull();
      expect(parseTargetFromText("")).toBeNull();
      expect(parseTargetFromText("random text")).toBeNull();
    });
  });

  describe("generateTargetFilters", () => {
    it("should generate type filters", () => {
      expect(generateTargetFilters("character")).toEqual([
        { filter: "type", value: "character" },
      ]);

      expect(generateTargetFilters("item")).toEqual([
        { filter: "type", value: "item" },
      ]);

      expect(generateTargetFilters("location")).toEqual([
        { filter: "type", value: "location" },
      ]);
    });

    it("should generate zone filters", () => {
      expect(generateTargetFilters("in play")).toEqual([
        { filter: "zone", value: "play" },
      ]);

      expect(generateTargetFilters("from your hand")).toEqual([
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
      ]);

      expect(generateTargetFilters("in discard")).toEqual([
        { filter: "zone", value: "discard" },
      ]);
    });

    it("should generate owner filters", () => {
      expect(generateTargetFilters("your character")).toEqual([
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
      ]);

      expect(generateTargetFilters("opponent character")).toEqual([
        { filter: "type", value: "character" },
        { filter: "owner", value: "opponent" },
      ]);
    });

    it("should generate status filters", () => {
      expect(generateTargetFilters("damaged character")).toEqual([
        { filter: "type", value: "character" },
        { filter: "status", value: "damaged" },
      ]);

      expect(generateTargetFilters("ready item")).toEqual([
        { filter: "type", value: "item" },
        { filter: "status", value: "ready" },
      ]);
    });

    it("should generate ability filters", () => {
      expect(generateTargetFilters("evasive character")).toEqual([
        { filter: "type", value: "character" },
        { filter: "ability", value: "evasive" },
      ]);

      expect(generateTargetFilters("ward character")).toEqual([
        { filter: "type", value: "character" },
        { filter: "ability", value: "ward" },
      ]);
    });

    it("should combine multiple filters", () => {
      expect(generateTargetFilters("your damaged character in play")).toEqual([
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "status", value: "damaged" },
      ]);
    });

    it("should return empty array for no matches", () => {
      expect(generateTargetFilters("unknown text")).toEqual([]);
    });
  });

  describe("validateTarget", () => {
    it("should validate card targets", () => {
      const validCardTarget = {
        type: "card" as const,
        value: 1,
        filters: [{ filter: "type" as const, value: "character" as const }],
      };
      expect(validateTarget(validCardTarget)).toBe(true);

      const invalidCardTarget = {
        type: "card" as const,
        value: 1,
        filters: [],
      };
      expect(validateTarget(invalidCardTarget)).toBe(false);
    });

    it("should validate player targets", () => {
      const validPlayerTarget = {
        type: "player" as const,
        value: "self" as const,
      };
      expect(validateTarget(validPlayerTarget)).toBe(true);

      const invalidPlayerTarget = {
        type: "player" as const,
        value: undefined as any,
      };
      expect(validateTarget(invalidPlayerTarget)).toBe(false);
    });

    it("should reject invalid targets", () => {
      expect(validateTarget(null as any)).toBe(false);
      expect(validateTarget(undefined as any)).toBe(false);
      expect(validateTarget({} as any)).toBe(false);
      expect(validateTarget({ type: "invalid" } as any)).toBe(false);
    });
  });

  describe("combineTargets", () => {
    it("should return null for empty array", () => {
      expect(combineTargets([])).toBeNull();
    });

    it("should return single target unchanged", () => {
      const target = chosenCharacter;
      expect(combineTargets([target])).toEqual(target);
    });

    it("should return first target for multiple targets", () => {
      const targets = [chosenCharacter, chosenCharacterOfYours];
      expect(combineTargets(targets)).toEqual(chosenCharacter);
    });

    it("should handle different operators", () => {
      const targets = [chosenCharacter, chosenCharacterOfYours];
      expect(combineTargets(targets, "and")).toEqual(chosenCharacter);
      expect(combineTargets(targets, "or")).toEqual(chosenCharacter);
    });
  });
});
