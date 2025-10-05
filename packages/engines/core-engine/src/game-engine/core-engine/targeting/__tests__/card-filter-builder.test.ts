/**
 * Tests for CardFilterBuilder - Fluent API for Building Filters
 *
 * Optional convenience utility for building card filters with a fluent API.
 * The builder produces plain JSON CardFilter objects.
 */

import { describe, expect, it } from "bun:test";
import type { BaseCoreCardFilter } from "../../types/game-specific-types";
import { CardFilterBuilder } from "../card-filter-builder";

describe("CardFilterBuilder - Fluent API", () => {
  describe("Zone Filters", () => {
    it("should build single zone filter", () => {
      const filter = new CardFilterBuilder().inZone("play").build();

      expect(filter).toEqual({
        zone: "play",
      });
    });

    it("should build multiple zones filter", () => {
      const filter = new CardFilterBuilder().inZones(["play", "hand"]).build();

      expect(filter).toEqual({
        zone: ["play", "hand"],
      });
    });
  });

  describe("Owner Filters", () => {
    it("should build self owner filter", () => {
      const filter = new CardFilterBuilder().controlledBy("self").build();

      expect(filter).toEqual({
        owner: "self",
      });
    });

    it("should build opponent owner filter", () => {
      const filter = new CardFilterBuilder().controlledBy("opponent").build();

      expect(filter).toEqual({
        owner: "opponent",
      });
    });

    it("should build specific player owner filter", () => {
      const filter = new CardFilterBuilder().controlledBy("player-123").build();

      expect(filter).toEqual({
        owner: "player-123",
      });
    });
  });

  describe("Type Filters", () => {
    it("should build single type filter", () => {
      const filter = new CardFilterBuilder().ofType("character").build();

      expect(filter).toEqual({
        type: "character",
      });
    });

    it("should build multiple types filter", () => {
      const filter = new CardFilterBuilder()
        .ofTypes(["character", "creature"])
        .build();

      expect(filter).toEqual({
        type: ["character", "creature"],
      });
    });
  });

  describe("Status Filters", () => {
    it("should build ready filter", () => {
      const filter = new CardFilterBuilder().ready().build();

      expect(filter).toEqual({
        ready: true,
      });
    });

    it("should build not ready filter", () => {
      const filter = new CardFilterBuilder().ready(false).build();

      expect(filter).toEqual({
        ready: false,
      });
    });

    it("should build exerted filter", () => {
      const filter = new CardFilterBuilder().exerted().build();

      expect(filter).toEqual({
        exerted: true,
      });
    });

    it("should build damaged filter", () => {
      const filter = new CardFilterBuilder().damaged().build();

      expect(filter).toEqual({
        damaged: true,
      });
    });

    it("should build not damaged filter", () => {
      const filter = new CardFilterBuilder().damaged(false).build();

      expect(filter).toEqual({
        damaged: false,
      });
    });

    it("should combine multiple status filters", () => {
      const filter = new CardFilterBuilder().ready(false).damaged(true).build();

      expect(filter).toEqual({
        ready: false,
        damaged: true,
      });
    });
  });

  describe("Attribute Filters", () => {
    it("should build cost equals filter", () => {
      const filter = new CardFilterBuilder().withCost("eq", 3).build();

      expect(filter).toEqual({
        cost: { operator: "eq", value: 3 },
      });
    });

    it("should build cost less than or equal filter", () => {
      const filter = new CardFilterBuilder().withCost("lte", 5).build();

      expect(filter).toEqual({
        cost: { operator: "lte", value: 5 },
      });
    });

    it("should build strength greater than or equal filter", () => {
      const filter = new CardFilterBuilder().withStrength("gte", 4).build();

      expect(filter).toEqual({
        strength: { operator: "gte", value: 4 },
      });
    });

    it("should build legacy cost range filter", () => {
      const filter = new CardFilterBuilder().withCostRange(2, 5).build();

      expect(filter).toEqual({
        cost: { min: 2, max: 5 },
      });
    });

    it("should build legacy exact cost filter", () => {
      const filter = new CardFilterBuilder().withExactCost(3).build();

      expect(filter).toEqual({
        cost: { exact: 3 },
      });
    });
  });

  describe("Name Filters", () => {
    it("should build name equals filter", () => {
      const filter = new CardFilterBuilder().named("eq", "Dragon").build();

      expect(filter).toEqual({
        name: { operator: "eq", value: "Dragon" },
      });
    });

    it("should build name includes filter", () => {
      const filter = new CardFilterBuilder()
        .named("includes", "Dragon")
        .build();

      expect(filter).toEqual({
        name: { operator: "includes", value: "Dragon" },
      });
    });

    it("should build case-insensitive name filter", () => {
      const filter = new CardFilterBuilder()
        .named("eq", "dragon", true)
        .build();

      expect(filter).toEqual({
        name: { operator: "eq", value: "dragon", caseInsensitive: true },
      });
    });

    it("should build name with multiple values", () => {
      const filter = new CardFilterBuilder()
        .named("eq", ["Dragon", "Knight"])
        .build();

      expect(filter).toEqual({
        name: { operator: "eq", value: ["Dragon", "Knight"] },
      });
    });
  });

  describe("Keyword Filters", () => {
    it("should build single keyword filter", () => {
      const filter = new CardFilterBuilder().withKeyword("flying").build();

      expect(filter).toEqual({
        withKeyword: "flying",
      });
    });

    it("should build multiple keywords filter", () => {
      const filter = new CardFilterBuilder()
        .withKeywords(["flying", "ward"])
        .build();

      expect(filter).toEqual({
        withKeyword: ["flying", "ward"],
      });
    });

    it("should build keyword exclusion filter", () => {
      const filter = new CardFilterBuilder().withoutKeyword("defender").build();

      expect(filter).toEqual({
        withoutKeyword: "defender",
      });
    });

    it("should build multiple keyword exclusions", () => {
      const filter = new CardFilterBuilder()
        .withoutKeywords(["defender", "vigilance"])
        .build();

      expect(filter).toEqual({
        withoutKeyword: ["defender", "vigilance"],
      });
    });

    it("should combine keyword inclusion and exclusion", () => {
      const filter = new CardFilterBuilder()
        .withKeyword("flying")
        .withoutKeyword("defender")
        .build();

      expect(filter).toEqual({
        withKeyword: "flying",
        withoutKeyword: "defender",
      });
    });
  });

  describe("Characteristics Filters", () => {
    it("should build single characteristic filter", () => {
      const filter = new CardFilterBuilder()
        .withCharacteristic("legendary")
        .build();

      expect(filter).toEqual({
        withCharacteristics: ["legendary"],
      });
    });

    it("should build multiple characteristics with ANY mode", () => {
      const filter = new CardFilterBuilder()
        .withCharacteristics(["hero", "villain"])
        .build();

      expect(filter).toEqual({
        withCharacteristics: ["hero", "villain"],
      });
    });

    it("should build characteristics with ALL mode", () => {
      const filter = new CardFilterBuilder()
        .withAllCharacteristics(["legendary", "hero"])
        .build();

      expect(filter).toEqual({
        withCharacteristics: ["legendary", "hero"],
        characteristicsMode: "all",
      });
    });
  });

  describe("Quantity Rules", () => {
    it("should build count filter", () => {
      const filter = new CardFilterBuilder().count(2).build();

      expect(filter).toEqual({
        count: 2,
      });
    });

    it("should build all filter", () => {
      const filter = new CardFilterBuilder().all().build();

      expect(filter).toEqual({
        count: "all",
      });
    });

    it("should build upTo filter", () => {
      const filter = new CardFilterBuilder().upTo(3).build();

      expect(filter).toEqual({
        count: 3,
        upTo: true,
      });
    });

    it("should build random filter", () => {
      const filter = new CardFilterBuilder().random(1).build();

      expect(filter).toEqual({
        count: 1,
        random: true,
      });
    });
  });

  describe("Other Filters", () => {
    it("should build excludeSelf filter", () => {
      const filter = new CardFilterBuilder().excludeSelf().build();

      expect(filter).toEqual({
        excludeSelf: true,
      });
    });

    it("should build publicId filter", () => {
      const filter = new CardFilterBuilder().withPublicId("card-123").build();

      expect(filter).toEqual({
        publicId: "card-123",
      });
    });

    it("should build instanceId filter", () => {
      const filter = new CardFilterBuilder()
        .withInstanceId("instance-456")
        .build();

      expect(filter).toEqual({
        instanceId: "instance-456",
      });
    });

    it("should build custom properties", () => {
      const filter = new CardFilterBuilder()
        .withCustom({ customProp: "value", anotherProp: 123 })
        .build();

      expect(filter).toEqual({
        custom: { customProp: "value", anotherProp: 123 },
      });
    });
  });

  describe("Method Chaining", () => {
    it("should chain multiple methods", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .controlledBy("opponent")
        .withCost("lte", 3)
        .damaged(true)
        .withKeyword("flying")
        .count(2)
        .build();

      expect(filter).toEqual({
        zone: "play",
        type: "character",
        owner: "opponent",
        cost: { operator: "lte", value: 3 },
        damaged: true,
        withKeyword: "flying",
        count: 2,
      });
    });

    it("should build complex targeting scenario", () => {
      // "Target up to 2 damaged opponent characters with cost 3 or less and flying"
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .controlledBy("opponent")
        .damaged(true)
        .withCost("lte", 3)
        .withKeyword("flying")
        .upTo(2)
        .build();

      expect(filter).toEqual({
        zone: "play",
        type: "character",
        owner: "opponent",
        damaged: true,
        cost: { operator: "lte", value: 3 },
        withKeyword: "flying",
        count: 2,
        upTo: true,
      });
    });
  });

  describe("Immutability", () => {
    it("should return new builder instance on each method call", () => {
      const builder1 = new CardFilterBuilder();
      const builder2 = builder1.inZone("play");
      const builder3 = builder2.ofType("character");

      expect(builder1).not.toBe(builder2);
      expect(builder2).not.toBe(builder3);
    });

    it("should not mutate original builder", () => {
      const builder = new CardFilterBuilder().inZone("play");
      const filter1 = builder.build();

      builder.ofType("character");
      const filter2 = builder.build();

      // Original filter unchanged
      expect(filter1).toEqual({ zone: "play" });
      expect(filter2).toEqual({ zone: "play" });
    });

    it("should produce independent filters", () => {
      const baseBuilder = new CardFilterBuilder()
        .inZone("play")
        .ofType("character");

      const filter1 = baseBuilder.controlledBy("self").build();
      const filter2 = baseBuilder.controlledBy("opponent").build();

      expect(filter1.owner).toBe("self");
      expect(filter2.owner).toBe("opponent");
    });
  });

  describe("Type Safety", () => {
    it("should produce type-safe BaseCoreCardFilter", () => {
      const filter: BaseCoreCardFilter = new CardFilterBuilder()
        .inZone("play")
        .build();

      expect(filter.zone).toBe("play");
    });

    it("should allow extending with game-specific builder", () => {
      // Demonstrating how games can extend the builder
      type LorcanaFilter = BaseCoreCardFilter & {
        readonly inkwell?: boolean;
        readonly atLocation?: boolean;
      };

      class LorcanaFilterBuilder extends CardFilterBuilder<LorcanaFilter> {
        constructor(initialFilter: Partial<LorcanaFilter> = {}) {
          super(initialFilter);
        }

        // Override base methods to return LorcanaFilterBuilder
        inZone(zone: string): LorcanaFilterBuilder {
          return new LorcanaFilterBuilder({
            ...this.filter,
            zone,
          });
        }

        // Game-specific methods
        inkwell(value: boolean): LorcanaFilterBuilder {
          return new LorcanaFilterBuilder({
            ...this.filter,
            inkwell: value,
          });
        }

        atLocation(): LorcanaFilterBuilder {
          return new LorcanaFilterBuilder({
            ...this.filter,
            atLocation: true,
          });
        }
      }

      const filter = new LorcanaFilterBuilder()
        .inZone("play")
        .inkwell(true)
        .atLocation()
        .build();

      expect(filter).toEqual({
        zone: "play",
        inkwell: true,
        atLocation: true,
      });
    });
  });

  describe("JSON Serializability", () => {
    it("should produce JSON-serializable output", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .withCost("lte", 3)
        .count(2)
        .build();

      const json = JSON.stringify(filter);
      const parsed = JSON.parse(json) as BaseCoreCardFilter;

      expect(parsed).toEqual(filter);
    });
  });

  describe("Empty Builder", () => {
    it("should build empty filter object", () => {
      const filter = new CardFilterBuilder().build();

      expect(filter).toEqual({});
    });
  });

  describe("Reset", () => {
    it("should reset builder to empty state", () => {
      const filter = new CardFilterBuilder()
        .inZone("play")
        .ofType("character")
        .reset()
        .inZone("hand")
        .build();

      expect(filter).toEqual({
        zone: "hand",
      });
    });
  });
});
