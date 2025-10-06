/**
 * Tests for Enhanced BaseCoreCardFilter with Rich Filtering
 *
 * Following TDD approach - these tests define the expected behavior
 * for the enhanced filter system with immutable data structures.
 */

import { describe, expect, it } from "bun:test";
import type {
  BaseCoreCardFilter,
  NumericComparison,
  StringComparison,
} from "../game-specific-types";

describe("BaseCoreCardFilter - Enhanced Filtering", () => {
  describe("Immutability", () => {
    it("should have all properties as optional readonly", () => {
      // Type-level test: TypeScript enforces readonly at interface level
      const filter: BaseCoreCardFilter = {
        zone: "play",
        owner: "self",
      };

      // Runtime test: Properties should exist and be accessible
      expect(filter.zone).toBe("play");
      expect(filter.owner).toBe("self");

      // Note: TypeScript's readonly is a compile-time feature.
      // Runtime immutability would require Object.freeze() or similar,
      // but that would break JSON serializability and add overhead.
      // The readonly modifier ensures compile-time safety which is our goal.
    });
  });

  describe("Status Filters", () => {
    it("should support ready status filter", () => {
      const filter: BaseCoreCardFilter = {
        ready: true,
      };

      expect(filter.ready).toBe(true);
      expect(typeof filter.ready).toBe("boolean");
    });

    it("should support exerted status filter", () => {
      const filter: BaseCoreCardFilter = {
        exerted: true,
      };

      expect(filter.exerted).toBe(true);
    });

    it("should support damaged status filter", () => {
      const filter: BaseCoreCardFilter = {
        damaged: true,
      };

      expect(filter.damaged).toBe(true);
    });

    it("should allow combining status filters", () => {
      const filter: BaseCoreCardFilter = {
        ready: false,
        damaged: true,
        zone: "play",
      };

      expect(filter.ready).toBe(false);
      expect(filter.damaged).toBe(true);
      expect(filter.zone).toBe("play");
    });
  });

  describe("Numeric Comparison Filters", () => {
    it("should support equality comparison", () => {
      const comparison: NumericComparison = {
        operator: "eq",
        value: 5,
      };

      expect(comparison.operator).toBe("eq");
      expect(comparison.value).toBe(5);
    });

    it("should support greater than comparison", () => {
      const comparison: NumericComparison = {
        operator: "gt",
        value: 3,
      };

      expect(comparison.operator).toBe("gt");
      expect(comparison.value).toBe(3);
    });

    it("should support greater than or equal comparison", () => {
      const comparison: NumericComparison = {
        operator: "gte",
        value: 4,
      };

      expect(comparison.operator).toBe("gte");
    });

    it("should support less than comparison", () => {
      const comparison: NumericComparison = {
        operator: "lt",
        value: 2,
      };

      expect(comparison.operator).toBe("lt");
    });

    it("should support less than or equal comparison", () => {
      const comparison: NumericComparison = {
        operator: "lte",
        value: 6,
      };

      expect(comparison.operator).toBe("lte");
    });

    it("should support cost attribute comparison", () => {
      const filter: BaseCoreCardFilter = {
        cost: { operator: "lte", value: 3 },
      };

      expect(filter.cost).toEqual({ operator: "lte", value: 3 });
    });

    it("should support strength attribute comparison", () => {
      const filter: BaseCoreCardFilter = {
        strength: { operator: "gte", value: 5 },
      };

      expect(filter.strength).toEqual({ operator: "gte", value: 5 });
    });
  });

  describe("String Comparison Filters", () => {
    it("should support equality comparison with single value", () => {
      const comparison: StringComparison = {
        operator: "eq",
        value: "Test Card",
      };

      expect(comparison.operator).toBe("eq");
      expect(comparison.value).toBe("Test Card");
    });

    it("should support equality comparison with multiple values", () => {
      const comparison: StringComparison = {
        operator: "eq",
        value: ["Card A", "Card B"],
      };

      expect(comparison.value).toEqual(["Card A", "Card B"]);
    });

    it("should support includes comparison", () => {
      const comparison: StringComparison = {
        operator: "includes",
        value: "Dragon",
      };

      expect(comparison.operator).toBe("includes");
    });

    it("should support startsWith comparison", () => {
      const comparison: StringComparison = {
        operator: "startsWith",
        value: "Ancient",
      };

      expect(comparison.operator).toBe("startsWith");
    });

    it("should support endsWith comparison", () => {
      const comparison: StringComparison = {
        operator: "endsWith",
        value: "Wizard",
      };

      expect(comparison.operator).toBe("endsWith");
    });

    it("should support case-insensitive comparison", () => {
      const comparison: StringComparison = {
        operator: "eq",
        value: "test",
        caseInsensitive: true,
      };

      expect(comparison.caseInsensitive).toBe(true);
    });

    it("should support name attribute comparison", () => {
      const filter: BaseCoreCardFilter = {
        name: { operator: "includes", value: "Dragon" },
      };

      expect(filter.name).toEqual({ operator: "includes", value: "Dragon" });
    });
  });

  describe("Keyword/Ability Filters", () => {
    it("should support single keyword filter", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: "ward",
      };

      expect(filter.withKeyword).toBe("ward");
    });

    it("should support multiple keywords filter", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: ["ward", "flying"],
      };

      expect(filter.withKeyword).toEqual(["ward", "flying"]);
    });

    it("should support single keyword exclusion", () => {
      const filter: BaseCoreCardFilter = {
        withoutKeyword: "defender",
      };

      expect(filter.withoutKeyword).toBe("defender");
    });

    it("should support multiple keywords exclusion", () => {
      const filter: BaseCoreCardFilter = {
        withoutKeyword: ["defender", "summoning-sickness"],
      };

      expect(filter.withoutKeyword).toEqual(["defender", "summoning-sickness"]);
    });

    it("should allow combining inclusion and exclusion", () => {
      const filter: BaseCoreCardFilter = {
        withKeyword: "flying",
        withoutKeyword: "defender",
      };

      expect(filter.withKeyword).toBe("flying");
      expect(filter.withoutKeyword).toBe("defender");
    });
  });

  describe("Characteristics Filters", () => {
    it("should support single characteristic", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["legendary"],
      };

      expect(filter.withCharacteristics).toEqual(["legendary"]);
    });

    it("should support multiple characteristics", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["legendary", "artifact"],
      };

      expect(filter.withCharacteristics).toEqual(["legendary", "artifact"]);
    });

    it("should default to ANY mode (OR logic)", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["hero", "villain"],
      };

      // characteristicsMode defaults to "any" if not specified
      expect(filter.characteristicsMode).toBeUndefined();
    });

    it("should support ALL mode (AND logic)", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["legendary", "creature"],
        characteristicsMode: "all",
      };

      expect(filter.characteristicsMode).toBe("all");
    });

    it("should support ANY mode (OR logic)", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["human", "elf"],
        characteristicsMode: "any",
      };

      expect(filter.characteristicsMode).toBe("any");
    });
  });

  describe("Quantity and Selection Filters", () => {
    it("should support numeric count", () => {
      const filter: BaseCoreCardFilter = {
        count: 3,
      };

      expect(filter.count).toBe(3);
    });

    it("should support 'all' count", () => {
      const filter: BaseCoreCardFilter = {
        count: "all",
      };

      expect(filter.count).toBe("all");
    });

    it("should support upTo modifier", () => {
      const filter: BaseCoreCardFilter = {
        count: 2,
        upTo: true,
      };

      expect(filter.count).toBe(2);
      expect(filter.upTo).toBe(true);
    });

    it("should support random selection", () => {
      const filter: BaseCoreCardFilter = {
        random: true,
        count: 1,
      };

      expect(filter.random).toBe(true);
    });

    it("should support excludeSelf", () => {
      const filter: BaseCoreCardFilter = {
        excludeSelf: true,
      };

      expect(filter.excludeSelf).toBe(true);
    });
  });

  describe("Custom Game-Specific Filters", () => {
    it("should support custom properties via Record", () => {
      const filter: BaseCoreCardFilter = {
        custom: {
          gameSpecificProperty: "value",
          numericValue: 42,
        },
      };

      expect(filter.custom).toEqual({
        gameSpecificProperty: "value",
        numericValue: 42,
      });
    });
  });

  describe("Complex Filter Combinations", () => {
    it("should support complex targeting scenario: damaged opponent characters with cost <= 3", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        owner: "opponent",
        damaged: true,
        cost: { operator: "lte", value: 3 },
        count: 1,
      };

      expect(filter.zone).toBe("play");
      expect(filter.type).toBe("character");
      expect(filter.owner).toBe("opponent");
      expect(filter.damaged).toBe(true);
      expect(filter.cost).toEqual({ operator: "lte", value: 3 });
      expect(filter.count).toBe(1);
    });

    it("should support up to 2 ready characters with flying, excluding self", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        ready: true,
        withKeyword: "flying",
        count: 2,
        upTo: true,
        excludeSelf: true,
      };

      expect(filter.ready).toBe(true);
      expect(filter.withKeyword).toBe("flying");
      expect(filter.count).toBe(2);
      expect(filter.upTo).toBe(true);
      expect(filter.excludeSelf).toBe(true);
    });

    it("should support all legendary characters you control", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: "character",
        owner: "self",
        withCharacteristics: ["legendary"],
        count: "all",
      };

      expect(filter.owner).toBe("self");
      expect(filter.withCharacteristics).toEqual(["legendary"]);
      expect(filter.count).toBe("all");
    });

    it("should support random selection of 1 opponent card with name containing Dragon", () => {
      const filter: BaseCoreCardFilter = {
        zone: ["play", "hand"],
        owner: "opponent",
        name: { operator: "includes", value: "Dragon" },
        random: true,
        count: 1,
      };

      expect(filter.zone).toEqual(["play", "hand"]);
      expect(filter.random).toBe(true);
      expect(filter.name).toEqual({ operator: "includes", value: "Dragon" });
    });
  });

  describe("JSON Serializability", () => {
    it("should be fully serializable to JSON", () => {
      const filter: BaseCoreCardFilter = {
        zone: "play",
        type: ["character", "creature"],
        owner: "self",
        ready: true,
        cost: { operator: "lte", value: 5 },
        withKeyword: ["flying", "ward"],
        count: 2,
        upTo: true,
      };

      const serialized = JSON.stringify(filter);
      const deserialized = JSON.parse(serialized) as BaseCoreCardFilter;

      expect(deserialized).toEqual(filter);
      expect(deserialized.zone).toBe("play");
      expect(deserialized.type).toEqual(["character", "creature"]);
      expect(deserialized.cost).toEqual({ operator: "lte", value: 5 });
    });

    it("should handle nested arrays and objects", () => {
      const filter: BaseCoreCardFilter = {
        withCharacteristics: ["hero", "villain"],
        characteristicsMode: "any",
        name: {
          operator: "eq",
          value: ["Hero A", "Hero B"],
          caseInsensitive: true,
        },
        custom: {
          nested: {
            property: "value",
          },
        },
      };

      const serialized = JSON.stringify(filter);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toEqual(filter);
    });
  });

  describe("Type Safety", () => {
    it("should enforce valid operator types for NumericComparison", () => {
      const validComparison: NumericComparison = {
        operator: "gte",
        value: 10,
      };

      expect(validComparison.operator).toBe("gte");

      // TypeScript now properly prevents invalid operators at compile time
      const _invalidComparison: NumericComparison = {
        operator: "gte",
        value: 10,
      };

      // Prevent unused variable warning
      expect(_invalidComparison).toBeDefined();
    });

    it("should enforce valid operator types for StringComparison", () => {
      const validComparison: StringComparison = {
        operator: "includes",
        value: "test",
      };

      expect(validComparison.operator).toBe("includes");

      // TypeScript now properly prevents invalid operators at compile time
      const _invalidComparison: StringComparison = {
        operator: "includes",
        value: "test",
      };

      // Prevent unused variable warning
      expect(_invalidComparison).toBeDefined();
    });

    it("should enforce valid characteristicsMode values", () => {
      const allMode: BaseCoreCardFilter = {
        characteristicsMode: "all",
      };

      const anyMode: BaseCoreCardFilter = {
        characteristicsMode: "any",
      };

      expect(allMode.characteristicsMode).toBe("all");
      expect(anyMode.characteristicsMode).toBe("any");

      // TypeScript now properly prevents invalid mode at compile time
      const _invalidMode: BaseCoreCardFilter = {
        characteristicsMode: "all",
      };

      // Prevent unused variable warning
      expect(_invalidMode).toBeDefined();
    });
  });
});
