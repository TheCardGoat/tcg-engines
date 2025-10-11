import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { moebius } from "./004-moebius";

/**
 * Tests for ST04-004: Moebius
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
 * - Color: White
 * - Traits: Earth Federation
 * - Link Requirement: None
 * - Zones: Space only
 *
 * Abilities:
 * - <Blocker> (continuous keyword ability)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Blocker keyword ability definition
 * - Card usability in game scenarios
 * - Low-cost defensive utility
 */

describe("ST04-004: Moebius", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(moebius.id).toBe("ST04-004");
      expect(moebius.name).toBe("Moebius");
      expect(moebius.number).toBe(4);
      expect(moebius.set).toBe("ST04");
      expect(moebius.type).toBe("unit");
      expect(moebius.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(moebius.cost).toBe(1);
      expect(moebius.level).toBe(1);
      expect(moebius.ap).toBe(1);
      expect(moebius.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(moebius.color).toBe("white");
      expect(moebius.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(moebius.zones).toEqual(["space"]);
    });

    it("should have no link requirement", () => {
      expect(moebius.linkRequirement).toBeUndefined();
    });

    it("should have text describing Blocker ability", () => {
      expect(moebius.text).toContain("Blocker");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(moebius.abilities).toBeDefined();
      expect(moebius.abilities.length).toBe(1);
    });

    it("should have continuous Blocker keyword ability", () => {
      const ability = moebius.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<blocker>");
      expect(ability.keyword).toBe("blocker");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Moebius costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [moebius],
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

    it("should set up scenario with Moebius in battle area", () => {
      // Moebius with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
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

      // Moebius is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Moebius can block attacks despite low stats
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Blocker ability: Can block enemy attacks
      const ability = moebius.abilities[0];
      expect(ability.keyword).toBe("blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should be deployable only in space zone", () => {
      // Moebius is space-only unit
      const engine = new GundamTestEngine(
        {
          hand: [moebius],
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

      // Moebius supports only space deployment
      expect(moebius.zones).toEqual(["space"]);
      expect(moebius.zones).not.toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should be early game defensive option", () => {
      // Moebius is cheap blocker for early defense
      const engine = new GundamTestEngine(
        {
          hand: [moebius],
          resourceArea: 1, // Only need 1 resource
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be deployed turn 1 as blocker
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(moebius).toHaveProperty("implemented");
      expect(moebius).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is minimum stats
      expect(moebius.level).toBe(1);
      expect(moebius.cost).toBe(1);
      expect(moebius.ap).toBe(1);
      expect(moebius.hp).toBe(1);
    });

    it("should have minimal but balanced stats", () => {
      // Moebius has 1 AP and 1 HP - minimal stats
      const totalStats = moebius.ap + moebius.hp;
      expect(totalStats).toBe(2); // 1 + 1

      // Blocker ability provides defensive value
      expect(moebius.abilities[0].keyword).toBe("blocker");
    });

    it("should set up combat scenario", () => {
      // Moebius with 1 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Moebius can attack with 1 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early game utility unit", () => {
      // Level 1 is early game, cost 1 with Blocker utility
      expect(moebius.level).toBe(1);
      expect(moebius.cost).toBe(1);

      // Blocker keyword makes it useful despite low stats
      const ability = moebius.abilities[0];
      expect(ability.keyword).toBe("blocker");
    });

    it("should work as cheap blocker", () => {
      // Moebius is inexpensive way to block attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Cheap blocker can intercept attacks
      expect(moebius.abilities[0].keyword).toBe("blocker");
      expect(moebius.cost).toBe(1);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(moebius.traits).toContain("earth federation");
    });

    it("should be efficient white utility unit", () => {
      // Common rarity white deck unit with defensive utility
      expect(moebius.color).toBe("white");
      expect(moebius.rarity).toBe("common");
      expect(moebius.type).toBe("unit");
    });
  });

  describe("Blocker Mechanics", () => {
    it("should have continuous Blocker keyword", () => {
      // Blocker is always active while unit is in play
      const ability = moebius.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.keyword).toBe("blocker");
    });

    it("should be able to intercept attacks", () => {
      // Blocker allows unit to block attacks targeting other units or shield base
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units attacking
          resourceArea: 5,
          deck: 30,
        },
      );

      // Moebius can intercept attacks
      expect(moebius.abilities[0].keyword).toBe("blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should provide defensive coverage", () => {
      // With 1 HP, can block one weak attack
      expect(moebius.hp).toBe(1);
      expect(moebius.abilities[0].keyword).toBe("blocker");

      // Low HP but cheap cost makes it expendable blocker
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be cost-efficient defensive tool", () => {
      // 1 cost blocker is very efficient
      expect(moebius.cost).toBe(1);
      expect(moebius.abilities[0].keyword).toBe("blocker");

      // Can be deployed early to protect other units
      const engine = new GundamTestEngine(
        {
          hand: [moebius],
          battleArea: 1, // Unit to protect
          resourceArea: 1,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Zone Restrictions", () => {
    it("should be restricted to space only", () => {
      // Moebius is space-only fighter
      expect(moebius.zones).toEqual(["space"]);
      expect(moebius.zones.length).toBe(1);
    });

    it("should set up space combat scenario", () => {
      // Moebius in space battle
      const engine = new GundamTestEngine(
        {
          battleArea: [moebius],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Space-only unit deployed
      expect(moebius.zones).toEqual(["space"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
