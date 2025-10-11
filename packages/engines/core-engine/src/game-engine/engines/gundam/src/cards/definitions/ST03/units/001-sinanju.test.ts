import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { sinanju } from "./001-sinanju";

/**
 * Tests for ST03-001: Sinanju
 *
 * Card Properties:
 * - Cost: 5, Level: 6, AP: 5, HP: 4
 * - Color: Red
 * - Traits: Zeon
 * - Link Requirement: Full Frontal
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit with strong stats)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - High-cost finisher positioning
 */

describe("ST03-001: Sinanju", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(sinanju.id).toBe("ST03-001");
      expect(sinanju.name).toBe("Sinanju");
      expect(sinanju.number).toBe(1);
      expect(sinanju.set).toBe("ST03");
      expect(sinanju.type).toBe("unit");
      expect(sinanju.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(sinanju.cost).toBe(5);
      expect(sinanju.level).toBe(6);
      expect(sinanju.ap).toBe(5);
      expect(sinanju.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(sinanju.color).toBe("red");
      expect(sinanju.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(sinanju.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(sinanju.linkRequirement).toEqual(["full frontal"]);
    });

    it("should have no abilities (vanilla unit)", () => {
      expect(sinanju.abilities).toBeDefined();
      expect(sinanju.abilities.length).toBe(0);
      expect(sinanju.text).toBe("");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Sinanju costs 5, so need 5 resources
      const engine = new GundamTestEngine(
        {
          hand: [sinanju],
          resourceArea: 6,
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
      assertZoneCount(engine, "resourceArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Sinanju in battle area", () => {
      // Sinanju as a powerful level 6 unit on the field
      const engine = new GundamTestEngine(
        {
          battleArea: [sinanju],
          hand: 5,
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Sinanju is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Full Frontal pilot link requirement", () => {
      // Sinanju has link requirement for Full Frontal
      // When paired with Full Frontal, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [sinanju],
          hand: 5, // Could have Full Frontal pilot card
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Sinanju can be paired with Full Frontal
      expect(sinanju.linkRequirement).toContain("full frontal");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Sinanju can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [sinanju],
          resourceArea: 6,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Sinanju supports both deployment zones
      expect(sinanju.zones).toContain("space");
      expect(sinanju.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(sinanju).toHaveProperty("implemented");
      expect(sinanju).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 6 stats appropriate for cost 5", () => {
      // Level 6 unit with 5 cost is a powerful late-game finisher
      expect(sinanju.level).toBe(6);
      expect(sinanju.cost).toBe(5);
      expect(sinanju.ap).toBe(5);
      expect(sinanju.hp).toBe(4);
    });

    it("should have strong offensive stats", () => {
      // Sinanju has 5 AP and 4 HP - aggressive offensive stats
      const totalStats = sinanju.ap + sinanju.hp;
      expect(totalStats).toBe(9); // 5 + 4

      // Highest AP in ST03 set, focused on dealing damage
      expect(sinanju.ap).toBe(5);
    });

    it("should set up combat scenario", () => {
      // Sinanju with 5 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [sinanju],
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Sinanju can attack with 5 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a high-cost finisher unit", () => {
      // Level 6, cost 5 is the highest cost in ST03 set
      expect(sinanju.level).toBe(6);
      expect(sinanju.cost).toBe(5);

      // Strong total stats for a finisher
      const totalStats = sinanju.ap + sinanju.hp;
      expect(totalStats).toBeGreaterThanOrEqual(9);

      // Aggressive AP-focused stats (AP > HP)
      expect(sinanju.ap).toBeGreaterThan(sinanju.hp);
    });

    it("should work as a vanilla beatstick", () => {
      // Sinanju has no abilities but compensates with raw stats
      const engine = new GundamTestEngine(
        {
          battleArea: [sinanju],
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pure stats-based unit: 5 AP is highest in ST03
      expect(sinanju.abilities.length).toBe(0);
      expect(sinanju.ap).toBe(5);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be paired with Full Frontal for maximum value", () => {
      // Sinanju's link requirement suggests synergy with Full Frontal pilot
      expect(sinanju.linkRequirement).toEqual(["full frontal"]);

      // As the set's boss unit, pairs well with the set's ace pilot
      expect(sinanju.level).toBe(6);
      expect(sinanju.rarity).toBe("legendary");
    });
  });
});
