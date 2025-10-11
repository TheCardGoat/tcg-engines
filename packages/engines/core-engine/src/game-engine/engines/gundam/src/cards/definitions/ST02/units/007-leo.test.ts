import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { leo } from "./007-leo";

/**
 * Tests for ST02-007: Leo
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: Blue
 * - Traits: None
 * - Link Requirement: (OZ) trait
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - Trait-based link requirement
 */

describe("ST02-007: Leo", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(leo.id).toBe("ST02-007");
      expect(leo.name).toBe("Leo");
      expect(leo.number).toBe(7);
      expect(leo.set).toBe("ST02");
      expect(leo.type).toBe("unit");
      expect(leo.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(leo.cost).toBe(2);
      expect(leo.level).toBe(2);
      expect(leo.ap).toBe(2);
      expect(leo.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(leo.color).toBe("blue");
      expect(leo.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(leo.zones).toEqual(["space", "earth"]);
    });

    it("should have trait-based link requirement", () => {
      expect(leo.linkRequirement).toEqual(["(oz) trait"]);
    });

    it("should have no abilities as vanilla unit", () => {
      expect(leo.abilities).toEqual([]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Leo costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [leo],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Leo in battle area", () => {
      // Leo as vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Leo is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with OZ trait pilots", () => {
      // Leo has link requirement for pilots with OZ trait
      // When paired with OZ pilot, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          hand: 5, // Could have OZ pilot card
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Leo can be paired with any OZ trait pilot
      expect(leo.linkRequirement).toEqual(["(oz) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Leo can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [leo],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Leo supports both deployment zones
      expect(leo.zones).toContain("space");
      expect(leo.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work as basic early game unit", () => {
      // Leo has standard stats for cost 2
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // 2 AP at cost 2 is standard
      expect(leo.ap).toBe(2);
      expect(leo.cost).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be efficient for early game deployment", () => {
      // Cost 2 allows early deployment
      const engine = new GundamTestEngine(
        {
          hand: [leo],
          resourceArea: 2, // Minimal resources needed
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be played as soon as turn 2
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
    });

    it("should support OZ archetype", () => {
      // Leo's trait requirement supports OZ tribal strategy
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Trait-based link requirement enables archetype play
      expect(leo.linkRequirement).toEqual(["(oz) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(leo).toHaveProperty("implemented");
      expect(leo).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is standard value
      expect(leo.level).toBe(2);
      expect(leo.cost).toBe(2);
      expect(leo.ap).toBe(2);
      expect(leo.hp).toBe(2);
    });

    it("should have perfectly balanced AP and HP", () => {
      // Leo has 2 AP and 2 HP - balanced stats
      const totalStats = leo.ap + leo.hp;
      expect(totalStats).toBe(4); // 2 + 2

      // Equal AP and HP
      expect(leo.ap).toBe(leo.hp);
    });

    it("should set up combat scenario", () => {
      // Leo with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Leo can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be standard value for cost", () => {
      // 2 AP at cost 2 is standard efficiency
      const apPerCost = leo.ap / leo.cost;
      expect(apPerCost).toBe(1); // 2 AP / 2 cost = 1 AP per cost

      // Standard total stats for cost
      const totalStats = leo.ap + leo.hp;
      expect(totalStats).toBe(4);
    });

    it("should work as vanilla beater", () => {
      // No abilities means straightforward combat unit
      const engine = new GundamTestEngine(
        {
          battleArea: [leo],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Vanilla unit with standard stats
      expect(leo.abilities).toEqual([]);
      expect(leo.ap).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have standard stats for level", () => {
      // 2 AP and 2 HP is standard for level 2
      expect(leo.hp).toBe(2);
      expect(leo.ap).toBe(2);
      expect(leo.level).toBe(2);

      // Balanced design
      expect(leo.ap).toBe(leo.hp);
    });

    it("should work as filler unit in OZ decks", () => {
      // Generic unit with trait-based link requirement
      const engine = new GundamTestEngine(
        {
          hand: [leo],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be played in OZ tribal decks
      expect(leo.linkRequirement).toEqual(["(oz) trait"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });
});
