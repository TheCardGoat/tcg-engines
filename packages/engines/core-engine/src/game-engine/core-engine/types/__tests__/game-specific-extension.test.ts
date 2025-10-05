/**
 * Tests for Game-Specific Filter Extensions
 *
 * Demonstrates how games can extend BaseCoreCardFilter with their own
 * game-specific properties while maintaining type safety and JSON serializability.
 */

import { describe, expect, it } from "bun:test";
import type {
  BaseCoreCardFilter,
  NumericComparison,
} from "../game-specific-types";

// Example: Lorcana-specific filter extension
type LorcanaCardFilter = BaseCoreCardFilter & {
  readonly inkwell?: boolean;
  readonly willpower?: NumericComparison;
  readonly loreValue?: NumericComparison;
  readonly atLocation?: boolean;
  readonly hasCardUnder?: boolean;
  readonly playedThisTurn?: boolean;
  readonly classification?: string | readonly string[]; // hero, villain, storyborn, etc.
  readonly color?: string | readonly string[]; // amber, amethyst, emerald, etc.
};

// Example: Pokemon-specific filter extension
type PokemonCardFilter = BaseCoreCardFilter & {
  readonly pokemonType?: string | readonly string[]; // fire, water, grass, etc.
  readonly evolutionStage?: "basic" | "stage1" | "stage2";
  readonly hasAbility?: boolean;
  readonly retreatCost?: NumericComparison;
  readonly weakness?: string;
  readonly resistance?: string;
};

// Example: Magic-specific filter extension
type MagicCardFilter = BaseCoreCardFilter & {
  readonly cardType?: string | readonly string[]; // instant, sorcery, creature, etc.
  readonly subtype?: string | readonly string[];
  readonly colorIdentity?: readonly string[];
  readonly manaCost?: NumericComparison;
  readonly convertedManaCost?: NumericComparison;
  readonly power?: NumericComparison;
  readonly toughness?: NumericComparison;
};

describe("Game-Specific Filter Extensions", () => {
  describe("Type Safety", () => {
    it("should allow Lorcana-specific properties", () => {
      const filter: LorcanaCardFilter = {
        zone: "play",
        type: "character",
        inkwell: true,
        willpower: { operator: "gte", value: 3 },
        classification: "hero",
        color: ["amber", "emerald"],
      };

      expect(filter.inkwell).toBe(true);
      expect(filter.willpower).toEqual({ operator: "gte", value: 3 });
      expect(filter.classification).toBe("hero");
      expect(filter.color).toEqual(["amber", "emerald"]);
    });

    it("should allow Pokemon-specific properties", () => {
      const filter: PokemonCardFilter = {
        zone: "play",
        type: "pokemon",
        pokemonType: "fire",
        evolutionStage: "stage1",
        hasAbility: true,
        retreatCost: { operator: "lte", value: 2 },
      };

      expect(filter.pokemonType).toBe("fire");
      expect(filter.evolutionStage).toBe("stage1");
      expect(filter.hasAbility).toBe(true);
    });

    it("should allow Magic-specific properties", () => {
      const filter: MagicCardFilter = {
        zone: "battlefield",
        cardType: "creature",
        subtype: ["elf", "warrior"],
        colorIdentity: ["green", "white"],
        power: { operator: "gte", value: 3 },
        toughness: { operator: "lte", value: 5 },
      };

      expect(filter.cardType).toBe("creature");
      expect(filter.subtype).toEqual(["elf", "warrior"]);
      expect(filter.colorIdentity).toEqual(["green", "white"]);
    });
  });

  describe("Inherits Core Filter Properties", () => {
    it("should allow all BaseCoreCardFilter properties in Lorcana filter", () => {
      const filter: LorcanaCardFilter = {
        zone: "play",
        owner: "self",
        type: "character",
        cost: { operator: "lte", value: 3 },
        strength: { operator: "gte", value: 4 },
        ready: true,
        damaged: false,
        withKeyword: "ward",
        withCharacteristics: ["hero", "princess"],
        characteristicsMode: "all",
        count: 2,
        upTo: true,
        excludeSelf: true,
        // Lorcana-specific
        inkwell: true,
        classification: "hero",
      };

      // Core properties
      expect(filter.zone).toBe("play");
      expect(filter.owner).toBe("self");
      expect(filter.type).toBe("character");
      expect(filter.withKeyword).toBe("ward");

      // Lorcana-specific properties
      expect(filter.inkwell).toBe(true);
      expect(filter.classification).toBe("hero");
    });
  });

  describe("JSON Serializability", () => {
    it("should serialize and deserialize Lorcana filter", () => {
      const filter: LorcanaCardFilter = {
        zone: "play",
        type: "character",
        cost: { operator: "lte", value: 3 },
        inkwell: true,
        classification: ["hero", "princess"],
        loreValue: { operator: "gte", value: 2 },
      };

      const json = JSON.stringify(filter);
      const parsed = JSON.parse(json) as LorcanaCardFilter;

      expect(parsed).toEqual(filter);
      expect(parsed.inkwell).toBe(true);
      expect(parsed.classification).toEqual(["hero", "princess"]);
    });

    it("should serialize and deserialize Pokemon filter", () => {
      const filter: PokemonCardFilter = {
        zone: "play",
        type: "pokemon",
        pokemonType: ["fire", "dragon"],
        evolutionStage: "stage2",
        retreatCost: { operator: "lte", value: 2 },
      };

      const json = JSON.stringify(filter);
      const parsed = JSON.parse(json) as PokemonCardFilter;

      expect(parsed).toEqual(filter);
      expect(parsed.pokemonType).toEqual(["fire", "dragon"]);
    });
  });

  describe("Complex Filters", () => {
    it("should support complex Lorcana targeting scenarios", () => {
      // "Target up to 2 damaged characters you control with Lore 2 or more"
      const filter: LorcanaCardFilter = {
        zone: "play",
        owner: "self",
        type: "character",
        damaged: true,
        loreValue: { operator: "gte", value: 2 },
        count: 2,
        upTo: true,
      };

      expect(filter.zone).toBe("play");
      expect(filter.owner).toBe("self");
      expect(filter.damaged).toBe(true);
      expect(filter.loreValue).toEqual({ operator: "gte", value: 2 });
      expect(filter.upTo).toBe(true);
    });

    it("should support location-specific Lorcana filters", () => {
      // "Target a character at a location"
      const filter: LorcanaCardFilter = {
        zone: "play",
        type: "character",
        atLocation: true,
        count: 1,
      };

      expect(filter.type).toBe("character");
      expect(filter.atLocation).toBe(true);
    });

    it("should support card-under filtering", () => {
      // "Target a location with cards under it"
      const filter: LorcanaCardFilter = {
        zone: "play",
        type: "location",
        hasCardUnder: true,
        count: 1,
      };

      expect(filter.type).toBe("location");
      expect(filter.hasCardUnder).toBe(true);
    });

    it("should filter by color", () => {
      // "Target an Amber or Emerald character"
      const filter: LorcanaCardFilter = {
        zone: "play",
        type: "character",
        color: ["amber", "emerald"],
        count: 1,
      };

      expect(filter.color).toEqual(["amber", "emerald"]);
    });
  });

  describe("Type Enforcement", () => {
    it("should enforce readonly properties", () => {
      const filter: LorcanaCardFilter = {
        zone: "play",
        inkwell: true,
      };

      // TypeScript should prevent mutation
      // @ts-expect-error - Cannot assign to readonly property
      filter.inkwell = false;

      // @ts-expect-error - Cannot assign to readonly property
      filter.zone = "hand";
    });

    it("should enforce valid numeric comparison operators", () => {
      const validFilter: LorcanaCardFilter = {
        loreValue: { operator: "gte", value: 2 },
      };

      expect(validFilter.loreValue?.operator).toBe("gte");

      // @ts-expect-error - Invalid operator
      const invalidFilter: LorcanaCardFilter = {
        loreValue: { operator: "invalid", value: 2 },
      };
    });
  });

  describe("Extension Pattern Documentation", () => {
    it("demonstrates how to create game-specific filter", () => {
      // Step 1: Define game-specific filter extending BaseCoreCardFilter
      type CustomGameFilter = BaseCoreCardFilter & {
        readonly customProperty?: string;
        readonly customNumeric?: NumericComparison;
      };

      // Step 2: Use the filter with type safety
      const filter: CustomGameFilter = {
        zone: "play",
        customProperty: "value",
        customNumeric: { operator: "eq", value: 5 },
      };

      // Step 3: Filter remains JSON-serializable
      const json = JSON.stringify(filter);
      const parsed = JSON.parse(json) as CustomGameFilter;

      expect(parsed).toEqual(filter);
    });

    it("demonstrates backward compatibility with core properties", () => {
      // Game-specific filters still work with core targeting APIs
      const lorcanaFilter: LorcanaCardFilter = {
        zone: "play",
        type: "character",
        inkwell: true, // Game-specific
      };

      // Can be used as BaseCoreCardFilter (game-specific props ignored by core)
      const coreFilter: BaseCoreCardFilter = lorcanaFilter;

      expect(coreFilter.zone).toBe("play");
      expect(coreFilter.type).toBe("character");
      // inkwell is extra data, core engine ignores it
    });
  });
});
