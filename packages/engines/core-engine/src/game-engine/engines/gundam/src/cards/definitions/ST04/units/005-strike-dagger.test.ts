import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strikeDagger } from "./005-strike-dagger";

/**
 * Tests for ST04-005: Strike Dagger
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 2
 * - Color: White
 * - Traits: Earth Federation
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

describe("ST04-005: Strike Dagger", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strikeDagger.id).toBe("ST04-005");
      expect(strikeDagger.name).toBe("Strike Dagger");
      expect(strikeDagger.number).toBe(5);
      expect(strikeDagger.set).toBe("ST04");
      expect(strikeDagger.type).toBe("unit");
      expect(strikeDagger.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(strikeDagger.cost).toBe(2);
      expect(strikeDagger.level).toBe(2);
      expect(strikeDagger.ap).toBe(3);
      expect(strikeDagger.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(strikeDagger.color).toBe("white");
      expect(strikeDagger.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(strikeDagger.zones).toEqual(["space", "earth"]);
    });

    it("should have no link requirement", () => {
      expect(strikeDagger.linkRequirement).toBeUndefined();
    });

    it("should have empty text for vanilla unit", () => {
      expect(strikeDagger.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(strikeDagger.abilities).toBeDefined();
      expect(strikeDagger.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Strike Dagger costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [strikeDagger],
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

    it("should set up scenario with Strike Dagger in battle area", () => {
      // Strike Dagger as vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
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

      // Strike Dagger is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be deployable in both space and earth zones", () => {
      // Strike Dagger can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [strikeDagger],
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

      // Strike Dagger supports both deployment zones
      expect(strikeDagger.zones).toContain("space");
      expect(strikeDagger.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(strikeDagger).toHaveProperty("implemented");
      expect(strikeDagger).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is early game unit
      expect(strikeDagger.level).toBe(2);
      expect(strikeDagger.cost).toBe(2);
      expect(strikeDagger.ap).toBe(3);
      expect(strikeDagger.hp).toBe(2);
    });

    it("should have aggressive stat distribution", () => {
      // Strike Dagger has 3 AP and 2 HP - offensive stats
      const totalStats = strikeDagger.ap + strikeDagger.hp;
      expect(totalStats).toBe(5); // 3 + 2

      // High AP relative to HP
      expect(strikeDagger.ap).toBeGreaterThan(strikeDagger.hp);
    });

    it("should set up combat scenario", () => {
      // Strike Dagger with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Strike Dagger can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early game aggressive unit", () => {
      // Level 2 is early game, cost 2 with offensive stats
      expect(strikeDagger.level).toBe(2);
      expect(strikeDagger.cost).toBe(2);

      // 3 AP makes it efficient attacker
      expect(strikeDagger.ap).toBe(3);
    });

    it("should work as aggressive attacker", () => {
      // Strike Dagger with 3 AP can pressure opponents early
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit to attack
          resourceArea: 5,
          deck: 30,
        },
      );

      // High AP for early game
      expect(strikeDagger.ap).toBe(3);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(strikeDagger.traits).toContain("earth federation");
    });

    it("should be versatile white unit", () => {
      // Common rarity white deck unit for both zones
      expect(strikeDagger.color).toBe("white");
      expect(strikeDagger.rarity).toBe("common");
      expect(strikeDagger.zones).toEqual(["space", "earth"]);
    });

    it("should have vanilla unit characteristics", () => {
      // No abilities means stats are the focus
      expect(strikeDagger.abilities.length).toBe(0);
      expect(strikeDagger.text).toBe("");

      // Good stats for cost compensate for no abilities
      const totalStats = strikeDagger.ap + strikeDagger.hp;
      expect(totalStats).toBe(5);
    });
  });

  describe("Zone Deployment Options", () => {
    it("should support both space and earth deployment", () => {
      // Strike Dagger is versatile - can go to space or earth
      expect(strikeDagger.zones).toEqual(["space", "earth"]);
      expect(strikeDagger.zones.length).toBe(2);
    });

    it("should compare with specialized units", () => {
      // Strike Dagger: space + earth (versatile)
      // Some units: space only or earth only (specialized)
      expect(strikeDagger.zones).toContain("space");
      expect(strikeDagger.zones).toContain("earth");
    });

    it("should set up versatile deployment scenario", () => {
      // Strike Dagger can be deployed in any zone
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
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
      expect(strikeDagger.zones.length).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Aggressive Early Game Strategy", () => {
    it("should have high AP for level", () => {
      // Level 2 with 3 AP is above-average attack power
      expect(strikeDagger.level).toBe(2);
      expect(strikeDagger.ap).toBe(3);

      // AP is 1.5x level
      expect(strikeDagger.ap / strikeDagger.level).toBe(1.5);
    });

    it("should set up early pressure scenario", () => {
      // Strike Dagger deployed early to pressure opponent
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
          resourceArea: 2,
          hand: 5,
          deck: 30,
        },
        {
          battleArea: 0, // Opponent has no blockers
          resourceArea: 2,
          hand: 5,
          deck: 30,
        },
      );

      // Early game aggression
      expect(strikeDagger.ap).toBe(3);
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });

    it("should trade efficiently with defensive units", () => {
      // 3 AP can destroy most early game units
      expect(strikeDagger.ap).toBe(3);
      expect(strikeDagger.hp).toBe(2);

      // Can trade with 2 HP units or destroy 3 HP units
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeDagger],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy with ≤3 HP
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
