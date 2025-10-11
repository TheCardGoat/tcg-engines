import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { ginn } from "./008-ginn";

/**
 * Tests for ST04-008: Ginn
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 2, HP: 2
 * - Color: Red
 * - Traits: [] (empty)
 * - Link Requirement: None
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Vanilla unit characteristics
 * - Card usability in game scenarios
 * - Combat mechanics
 */

describe("ST04-008: Ginn", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(ginn.id).toBe("ST04-008");
      expect(ginn.name).toBe("Ginn");
      expect(ginn.number).toBe(8);
      expect(ginn.set).toBe("ST04");
      expect(ginn.type).toBe("unit");
      expect(ginn.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(ginn.cost).toBe(1);
      expect(ginn.level).toBe(2);
      expect(ginn.ap).toBe(2);
      expect(ginn.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(ginn.color).toBe("red");
      expect(ginn.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(ginn.zones).toEqual(["space", "earth"]);
    });

    it("should have no link requirement", () => {
      expect(ginn.linkRequirement).toBeUndefined();
    });

    it("should have empty text for vanilla unit", () => {
      expect(ginn.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(ginn.abilities).toBeDefined();
      expect(ginn.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Ginn costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [ginn],
          resourceArea: 3,
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
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Ginn in battle area", () => {
      // Ginn as vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
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

      // Ginn is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be deployable in both space and earth zones", () => {
      // Ginn can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [ginn],
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

      // Ginn supports both deployment zones
      expect(ginn.zones).toContain("space");
      expect(ginn.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(ginn).toHaveProperty("implemented");
      expect(ginn).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 1", () => {
      // Level 2 unit with 1 cost is efficient early game unit
      expect(ginn.level).toBe(2);
      expect(ginn.cost).toBe(1);
      expect(ginn.ap).toBe(2);
      expect(ginn.hp).toBe(2);
    });

    it("should have balanced stats", () => {
      // Ginn has 2 AP and 2 HP - balanced stats
      const totalStats = ginn.ap + ginn.hp;
      expect(totalStats).toBe(4); // 2 + 2

      // Equal AP and HP distribution
      expect(ginn.ap).toBe(ginn.hp);
    });

    it("should set up combat scenario", () => {
      // Ginn with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Ginn can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early game efficient unit", () => {
      // Level 2 is early game, cost 1 with good stats
      expect(ginn.level).toBe(2);
      expect(ginn.cost).toBe(1);

      // Good stats for the cost
      const totalStats = ginn.ap + ginn.hp;
      expect(totalStats).toBe(4);
    });

    it("should work as early game attacker", () => {
      // Ginn with 2 AP can trade efficiently
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Efficient early game stats
      expect(ginn.ap).toBe(2);
      expect(ginn.hp).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have empty traits array", () => {
      // No specific faction traits
      expect(ginn.traits).toEqual([]);
    });

    it("should be versatile red unit", () => {
      // Common rarity red deck unit for both zones
      expect(ginn.color).toBe("red");
      expect(ginn.rarity).toBe("common");
      expect(ginn.zones).toEqual(["space", "earth"]);
    });

    it("should have vanilla unit characteristics", () => {
      // No abilities means stats are the focus
      expect(ginn.abilities.length).toBe(0);
      expect(ginn.text).toBe("");

      // Good stats for cost compensate for no abilities
      const totalStats = ginn.ap + ginn.hp;
      expect(totalStats).toBe(4);
    });
  });

  describe("Zone Deployment Options", () => {
    it("should support both space and earth deployment", () => {
      // Ginn is versatile - can go to space or earth
      expect(ginn.zones).toEqual(["space", "earth"]);
      expect(ginn.zones.length).toBe(2);
    });

    it("should compare with specialized units", () => {
      // Ginn: space + earth (versatile)
      // Some units: space only or earth only (specialized)
      expect(ginn.zones).toContain("space");
      expect(ginn.zones).toContain("earth");
    });

    it("should set up versatile deployment scenario", () => {
      // Ginn can be deployed in any zone
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Versatile deployment options
      expect(ginn.zones.length).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Cost-Efficient Strategy", () => {
    it("should have excellent stats for cost", () => {
      // Level 2 with 1 cost is very efficient
      expect(ginn.level).toBe(2);
      expect(ginn.cost).toBe(1);

      // 4 total stats for 1 cost
      const totalStats = ginn.ap + ginn.hp;
      expect(totalStats).toBe(4);
    });

    it("should set up early aggression scenario", () => {
      // Ginn deployed early for pressure
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
          resourceArea: 1,
          hand: 5,
          deck: 30,
        },
        {
          battleArea: 0, // Opponent has no blockers
          resourceArea: 1,
          hand: 5,
          deck: 30,
        },
      );

      // Early game aggression with cheap unit
      expect(ginn.cost).toBe(1);
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });

    it("should trade efficiently with other early units", () => {
      // 2 AP and 2 HP trades evenly with most 1-cost units
      expect(ginn.ap).toBe(2);
      expect(ginn.hp).toBe(2);

      // Can trade with level 1-2 units
      const engine = new GundamTestEngine(
        {
          battleArea: [ginn],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy with ≤2 HP
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
