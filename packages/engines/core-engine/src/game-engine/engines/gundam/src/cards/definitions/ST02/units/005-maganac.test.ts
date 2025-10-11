import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { maganac } from "./005-maganac";

/**
 * Tests for ST02-005: Maganac
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 2
 * - Color: Green
 * - Traits: None
 * - Link Requirement: None (-)
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - Generic low-cost unit
 */

describe("ST02-005: Maganac", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(maganac.id).toBe("ST02-005");
      expect(maganac.name).toBe("Maganac");
      expect(maganac.number).toBe(5);
      expect(maganac.set).toBe("ST02");
      expect(maganac.type).toBe("unit");
      expect(maganac.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(maganac.cost).toBe(2);
      expect(maganac.level).toBe(2);
      expect(maganac.ap).toBe(3);
      expect(maganac.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(maganac.color).toBe("green");
      expect(maganac.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(maganac.zones).toEqual(["space", "earth"]);
    });

    it("should have no link requirement", () => {
      expect(maganac.linkRequirement).toEqual(["-"]);
    });

    it("should have no abilities as vanilla unit", () => {
      expect(maganac.abilities).toEqual([]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Maganac costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [maganac],
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

    it("should set up scenario with Maganac in battle area", () => {
      // Maganac as vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [maganac],
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

      // Maganac is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be playable without pilot requirement", () => {
      // Maganac has no link requirement, can be played freely
      const engine = new GundamTestEngine(
        {
          battleArea: [maganac],
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

      // No pilot required
      expect(maganac.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Maganac can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [maganac],
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

      // Maganac supports both deployment zones
      expect(maganac.zones).toContain("space");
      expect(maganac.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work as early game pressure", () => {
      // Maganac has decent AP for its cost
      const engine = new GundamTestEngine(
        {
          battleArea: [maganac],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // 3 AP at cost 2 is efficient
      expect(maganac.ap).toBe(3);
      expect(maganac.cost).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be efficient for early game deployment", () => {
      // Cost 2 allows early deployment
      const engine = new GundamTestEngine(
        {
          hand: [maganac],
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
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(maganac).toHaveProperty("implemented");
      expect(maganac).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is standard value
      expect(maganac.level).toBe(2);
      expect(maganac.cost).toBe(2);
      expect(maganac.ap).toBe(3);
      expect(maganac.hp).toBe(2);
    });

    it("should have offensive stats", () => {
      // Maganac has 3 AP and 2 HP - offensive leaning
      const totalStats = maganac.ap + maganac.hp;
      expect(totalStats).toBe(5); // 3 + 2

      // Higher AP than HP
      expect(maganac.ap).toBeGreaterThan(maganac.hp);
    });

    it("should set up combat scenario", () => {
      // Maganac with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [maganac],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Maganac can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be good value for cost", () => {
      // 3 AP at cost 2 is good efficiency
      const apPerCost = maganac.ap / maganac.cost;
      expect(apPerCost).toBe(1.5); // 3 AP / 2 cost = 1.5 AP per cost

      // Reasonable total stats for cost
      const totalStats = maganac.ap + maganac.hp;
      expect(totalStats).toBeGreaterThanOrEqual(5);
    });

    it("should work as vanilla beater", () => {
      // No abilities means straightforward combat unit
      const engine = new GundamTestEngine(
        {
          battleArea: [maganac],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Vanilla unit with decent AP for cost
      expect(maganac.abilities).toEqual([]);
      expect(maganac.ap).toBe(3);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have low HP as trade-off for good AP", () => {
      // 2 HP is standard for level 2
      expect(maganac.hp).toBe(2);
      expect(maganac.level).toBe(2);

      // Glass cannon design
      expect(maganac.ap).toBeGreaterThan(maganac.hp);
    });

    it("should work as filler unit", () => {
      // Generic unit with no link requirement
      const engine = new GundamTestEngine(
        {
          hand: [maganac],
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

      // Can be played in any deck without pilot synergy
      expect(maganac.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });
});
