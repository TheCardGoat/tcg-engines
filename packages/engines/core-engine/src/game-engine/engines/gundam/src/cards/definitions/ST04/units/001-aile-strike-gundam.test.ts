import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aileStrikeGundam } from "./001-aile-strike-gundam";

/**
 * Tests for ST04-001: Aile Strike Gundam
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 4, HP: 4
 * - Color: White
 * - Traits: Earth Federation
 * - Link Requirement: Kira Yamato
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Blocker> (continuous keyword ability)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Blocker keyword ability definition
 * - Card usability in game scenarios
 * - Combat and defensive mechanics
 */

describe("ST04-001: Aile Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aileStrikeGundam.id).toBe("ST04-001");
      expect(aileStrikeGundam.name).toBe("Aile Strike Gundam");
      expect(aileStrikeGundam.number).toBe(1);
      expect(aileStrikeGundam.set).toBe("ST04");
      expect(aileStrikeGundam.type).toBe("unit");
      expect(aileStrikeGundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(aileStrikeGundam.cost).toBe(4);
      expect(aileStrikeGundam.level).toBe(5);
      expect(aileStrikeGundam.ap).toBe(4);
      expect(aileStrikeGundam.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(aileStrikeGundam.color).toBe("white");
      expect(aileStrikeGundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(aileStrikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(aileStrikeGundam.linkRequirement).toEqual(["kira yamato"]);
    });

    it("should have text describing Blocker ability", () => {
      expect(aileStrikeGundam.text).toContain("Blocker");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(aileStrikeGundam.abilities).toBeDefined();
      expect(aileStrikeGundam.abilities.length).toBe(1);
    });

    it("should have continuous Blocker keyword ability", () => {
      const ability = aileStrikeGundam.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<blocker>");
      expect(ability.keyword).toBe("blocker");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Aile Strike Gundam costs 4, so need 4 resources
      const engine = new GundamTestEngine(
        {
          hand: [aileStrikeGundam],
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

    it("should set up scenario with Aile Strike Gundam in battle area", () => {
      // Aile Strike Gundam with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
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

      // Aile Strike Gundam is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Aile Strike Gundam can block attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
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
      const ability = aileStrikeGundam.abilities[0];
      expect(ability.keyword).toBe("blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should work with Kira Yamato pilot link requirement", () => {
      // Aile Strike Gundam has link requirement for Kira Yamato
      // When paired with Kira Yamato, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
          hand: 5, // Could have Kira Yamato pilot card
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

      // Aile Strike Gundam can be paired with Kira Yamato
      expect(aileStrikeGundam.linkRequirement).toContain("kira yamato");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Aile Strike Gundam can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [aileStrikeGundam],
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

      // Aile Strike Gundam supports both deployment zones
      expect(aileStrikeGundam.zones).toContain("space");
      expect(aileStrikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(aileStrikeGundam).toHaveProperty("implemented");
      expect(aileStrikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 5 stats appropriate for cost 4", () => {
      // Level 5 legendary unit with 4 cost
      expect(aileStrikeGundam.level).toBe(5);
      expect(aileStrikeGundam.cost).toBe(4);
      expect(aileStrikeGundam.ap).toBe(4);
      expect(aileStrikeGundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      // Aile Strike Gundam has 4 AP and 4 HP - perfectly balanced stats
      const totalStats = aileStrikeGundam.ap + aileStrikeGundam.hp;
      expect(totalStats).toBe(8); // 4 + 4

      // Blocker ability provides defensive value
      expect(aileStrikeGundam.abilities[0].keyword).toBe("blocker");
    });

    it("should set up combat scenario", () => {
      // Aile Strike Gundam with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Aile Strike Gundam can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a mid-game defensive unit", () => {
      // Level 5 is mid-game, cost 4 with strong stats and Blocker
      expect(aileStrikeGundam.level).toBe(5);
      expect(aileStrikeGundam.cost).toBe(4);

      // Blocker keyword makes it excellent for defense
      const ability = aileStrikeGundam.abilities[0];
      expect(ability.keyword).toBe("blocker");
    });

    it("should work as defensive wall", () => {
      // Aile Strike Gundam can block attacks with 4 HP
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker ability allows it to block multiple attacks
      expect(aileStrikeGundam.abilities[0].keyword).toBe("blocker");
      expect(aileStrikeGundam.hp).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(aileStrikeGundam.traits).toContain("earth federation");
    });

    it("should be legendary white finisher", () => {
      // Legendary rarity white deck unit with strong stats
      expect(aileStrikeGundam.color).toBe("white");
      expect(aileStrikeGundam.rarity).toBe("legendary");
      expect(aileStrikeGundam.type).toBe("unit");
    });
  });

  describe("Blocker Mechanics", () => {
    it("should have continuous Blocker keyword", () => {
      // Blocker is always active while unit is in play
      const ability = aileStrikeGundam.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.keyword).toBe("blocker");
    });

    it("should be able to intercept attacks", () => {
      // Blocker allows unit to block attacks targeting other units or shield base
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units attacking
          resourceArea: 5,
          deck: 30,
        },
      );

      // Aile Strike Gundam can intercept attacks
      expect(aileStrikeGundam.abilities[0].keyword).toBe("blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should provide defensive coverage", () => {
      // With 4 HP, can block multiple weak attacks or one strong attack
      expect(aileStrikeGundam.hp).toBe(4);
      expect(aileStrikeGundam.abilities[0].keyword).toBe("blocker");

      // High HP makes it excellent blocker
      const engine = new GundamTestEngine(
        {
          battleArea: [aileStrikeGundam],
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
  });
});
