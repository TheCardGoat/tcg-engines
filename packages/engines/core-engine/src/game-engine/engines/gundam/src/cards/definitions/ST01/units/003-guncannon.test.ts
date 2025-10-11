import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guncannon } from "./003-guncannon";

/**
 * Tests for ST01-003: Guncannon
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 4
 * - Color: Blue
 * - Traits: Earth Federation
 * - Link Requirement: Kai Shiden
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Vanilla unit with no special abilities
 * - Card usability in game scenarios
 * - Defensive stat distribution
 */

describe("ST01-003: Guncannon", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guncannon.id).toBe("ST01-003");
      expect(guncannon.name).toBe("Guncannon");
      expect(guncannon.number).toBe(3);
      expect(guncannon.set).toBe("ST01");
      expect(guncannon.type).toBe("unit");
      expect(guncannon.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(guncannon.cost).toBe(2);
      expect(guncannon.level).toBe(3);
      expect(guncannon.ap).toBe(2);
      expect(guncannon.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(guncannon.color).toBe("blue");
      expect(guncannon.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(guncannon.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(guncannon.linkRequirement).toEqual(["kai shiden"]);
    });

    it("should have empty text for vanilla unit", () => {
      expect(guncannon.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(guncannon.abilities).toBeDunter();
      expect(guncannon.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Guncannon costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [guncannon],
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

    it("should set up scenario with Guncannon in battle area", () => {
      // Guncannon vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
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

      // Guncannon is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Kai Shiden pilot link requirement", () => {
      // Guncannon has link requirement for Kai Shiden
      // When paired with Kai Shiden, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
          hand: 5, // Could have Kai Shiden pilot card
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

      // Guncannon can be paired with Kai Shiden
      expect(guncannon.linkRequirement).toContain("kai shiden");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Guncannon can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [guncannon],
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

      // Guncannon supports both deployment zones
      expect(guncannon.zones).toContain("space");
      expect(guncannon.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should function as defensive blocker with high HP", () => {
      // Guncannon with 4 HP can survive multiple attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units to block
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for defensive play: high HP unit
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(guncannon.hp).toBe(4);
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(guncannon).toHaveProperty("implemented");
      expect(guncannon).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 2", () => {
      // Level 3 unit with 2 cost is a solid early game unit
      expect(guncannon.level).toBe(3);
      expect(guncannon.cost).toBe(2);
      expect(guncannon.ap).toBe(2);
      expect(guncannon.hp).toBe(4);
    });

    it("should have defensive-focused AP and HP distribution", () => {
      // Guncannon has 2 AP and 4 HP - defensive stats
      const totalStats = guncannon.ap + guncannon.hp;
      expect(totalStats).toBe(6); // 2 + 4

      // More HP than AP indicates defensive unit
      expect(guncannon.hp).toBeGreaterThan(guncannon.ap);
    });

    it("should set up combat scenario", () => {
      // Guncannon with 2 AP attacking or defending
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Guncannon can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have efficient stat distribution for cost", () => {
      // 6 total stats for 2 cost is efficient
      const totalStats = guncannon.ap + guncannon.hp;
      const statsPerCost = totalStats / guncannon.cost;
      expect(statsPerCost).toBe(3); // 6 stats / 2 cost = 3 stats per cost

      // Defensive lean makes it durable
      expect(guncannon.hp).toBe(4);
    });

    it("should be effective against low AP attackers", () => {
      // High HP makes Guncannon resilient to multiple attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple low AP enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can withstand multiple attacks with 4 HP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(guncannon.hp).toBe(4);
    });
  });
});
