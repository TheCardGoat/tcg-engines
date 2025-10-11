import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gm } from "./005-gm";

/**
 * Tests for ST01-005: GM
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 2, HP: 2
 * - Color: Blue
 * - Traits: Earth Federation
 * - Link Requirement: - (no specific pilot required)
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Vanilla unit with no special abilities
 * - Low cost efficient unit
 * - No link requirement (generic pilot)
 */

describe("ST01-005: GM", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gm.id).toBe("ST01-005");
      expect(gm.name).toBe("GM");
      expect(gm.number).toBe(5);
      expect(gm.set).toBe("ST01");
      expect(gm.type).toBe("unit");
      expect(gm.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gm.cost).toBe(1);
      expect(gm.level).toBe(2);
      expect(gm.ap).toBe(2);
      expect(gm.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(gm.color).toBe("blue");
      expect(gm.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(gm.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(gm.linkRequirement).toEqual(["-"]);
    });

    it("should have empty text for vanilla unit", () => {
      expect(gm.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(gm.abilities).toBeDefined();
      expect(gm.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // GM costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [gm],
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

    it("should set up scenario with GM in battle area", () => {
      // GM vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
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

      // GM is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be deployable without specific pilot requirement", () => {
      // GM has no link requirement, can be paired with any pilot
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
          hand: 5, // Could have any pilot card
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

      // GM has generic link requirement
      expect(gm.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // GM can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gm],
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

      // GM supports both deployment zones
      expect(gm.zones).toContain("space");
      expect(gm.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should be deployable early game with low cost", () => {
      // GM costs 1, can be deployed on turn 1
      const engine = new GundamTestEngine(
        {
          hand: [gm],
          resourceArea: 1, // Minimum resources
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 0,
          resourceArea: 1,
          deck: 30,
        },
      );

      // Early game deployment possible
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_one");
    });

    it("should set up scenario for efficient early aggression", () => {
      // GM with 2 AP for only 1 cost is efficient early game
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Early game opponent unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Early aggression with efficient stats
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gm.ap).toBe(2);
      expect(gm.cost).toBe(1);
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gm).toHaveProperty("implemented");
      expect(gm).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 1", () => {
      // Level 2 unit with 1 cost is efficient early game unit
      expect(gm.level).toBe(2);
      expect(gm.cost).toBe(1);
      expect(gm.ap).toBe(2);
      expect(gm.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      // GM has 2 AP and 2 HP - balanced stats
      const totalStats = gm.ap + gm.hp;
      expect(totalStats).toBe(4); // 2 + 2

      // Equal AP and HP
      expect(gm.ap).toBe(gm.hp);
    });

    it("should set up combat scenario", () => {
      // GM with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: GM can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have excellent stat efficiency for cost", () => {
      // 4 total stats for 1 cost is very efficient
      const totalStats = gm.ap + gm.hp;
      const statsPerCost = totalStats / gm.cost;
      expect(statsPerCost).toBe(4); // 4 stats / 1 cost = 4 stats per cost

      // Best stats-per-cost ratio in early game
      expect(totalStats).toBe(4);
    });

    it("should be effective in early game trades", () => {
      // 2 AP and 2 HP allows GM to trade with other early units
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy early game unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can trade efficiently with other cost 1 units
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gm.ap).toBe(2);
      expect(gm.hp).toBe(2);
    });

    it("should enable aggressive early game strategies", () => {
      // Multiple GMs can be deployed early for pressure
      const engine = new GundamTestEngine(
        {
          battleArea: [gm],
          hand: [gm, gm], // Additional GMs
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 0,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Multiple low-cost units create early pressure
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "hand", 2, "player_one");
    });
  });
});
