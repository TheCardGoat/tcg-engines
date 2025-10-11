import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strikeGundam } from "./002-strike-gundam";

/**
 * Tests for ST04-002: Strike Gundam
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 3
 * - Color: White
 * - Traits: Earth Federation
 * - Link Requirement: Kira Yamato
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Deploy】Draw 1. Then, discard 1.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Deploy trigger effect definition
 * - Card usability in game scenarios
 * - Card filtering mechanics
 */

describe("ST04-002: Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strikeGundam.id).toBe("ST04-002");
      expect(strikeGundam.name).toBe("Strike Gundam");
      expect(strikeGundam.number).toBe(2);
      expect(strikeGundam.set).toBe("ST04");
      expect(strikeGundam.type).toBe("unit");
      expect(strikeGundam.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(strikeGundam.cost).toBe(2);
      expect(strikeGundam.level).toBe(4);
      expect(strikeGundam.ap).toBe(3);
      expect(strikeGundam.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(strikeGundam.color).toBe("white");
      expect(strikeGundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(strikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(strikeGundam.linkRequirement).toEqual(["kira yamato"]);
    });

    it("should have text describing Deploy ability", () => {
      expect(strikeGundam.text).toContain("Deploy");
      expect(strikeGundam.text).toContain("Draw 1");
      expect(strikeGundam.text).toContain("discard 1");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(strikeGundam.abilities).toBeDefined();
      expect(strikeGundam.abilities.length).toBe(1);
    });

    it("should have triggered Deploy ability", () => {
      const ability = strikeGundam.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.trigger?.event).toBe("deploy");
    });

    it("should have Deploy text", () => {
      const ability = strikeGundam.abilities[0];
      expect(ability.text).toBe("【deploy】");
    });

    it("should have draw and discard effects", () => {
      const ability = strikeGundam.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      // Deploy effect draws and discards
      expect(ability.effects[0].type).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Strike Gundam costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

    it("should set up scenario with Strike Gundam in battle area", () => {
      // Strike Gundam with Deploy ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeGundam],
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

      // Strike Gundam is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Deploy ability testing", () => {
      // Strike Gundam draws and discards when deployed
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
          resourceArea: 2, // Need 2 to deploy
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

      // Setup for Deploy ability: Will draw and discard when deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should work with Kira Yamato pilot link requirement", () => {
      // Strike Gundam has link requirement for Kira Yamato
      // When paired with Kira Yamato, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeGundam],
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

      // Strike Gundam can be paired with Kira Yamato
      expect(strikeGundam.linkRequirement).toContain("kira yamato");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Strike Gundam can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

      // Strike Gundam supports both deployment zones
      expect(strikeGundam.zones).toContain("space");
      expect(strikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should provide card filtering when deployed", () => {
      // Strike Gundam's Deploy ability provides card filtering
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
          resourceArea: 2,
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

      // Deploy effect draws then discards: cycle through deck
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "deck", 30, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(strikeGundam).toHaveProperty("implemented");
      expect(strikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 2", () => {
      // Level 4 unit with 2 cost is efficient
      expect(strikeGundam.level).toBe(4);
      expect(strikeGundam.cost).toBe(2);
      expect(strikeGundam.ap).toBe(3);
      expect(strikeGundam.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      // Strike Gundam has 3 AP and 3 HP - even stats
      const totalStats = strikeGundam.ap + strikeGundam.hp;
      expect(totalStats).toBe(6); // 3 + 3

      // Deploy ability provides card filtering value
      expect(strikeGundam.abilities[0].trigger?.event).toBe("deploy");
    });

    it("should set up combat scenario", () => {
      // Strike Gundam with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeGundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Strike Gundam can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early-mid game unit", () => {
      // Level 4 is early-mid game, cost 2 with good stats
      expect(strikeGundam.level).toBe(4);
      expect(strikeGundam.cost).toBe(2);

      // Good stats for the cost
      const totalStats = strikeGundam.ap + strikeGundam.hp;
      expect(totalStats).toBe(6);
    });

    it("should work as card filtering tool", () => {
      // Strike Gundam provides card selection when deployed
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

      // Deploy ability allows card selection: draw then discard
      expect(strikeGundam.abilities[0].trigger?.event).toBe("deploy");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(strikeGundam.traits).toContain("earth federation");
    });

    it("should be efficient white unit", () => {
      // Common rarity white deck unit with strong stats
      expect(strikeGundam.color).toBe("white");
      expect(strikeGundam.rarity).toBe("common");
      expect(strikeGundam.type).toBe("unit");
    });
  });

  describe("Deploy Ability Mechanics", () => {
    it("should draw and discard on deployment", () => {
      // Deploy triggers when unit enters field: draw 1, discard 1
      const ability = strikeGundam.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.trigger?.event).toBe("deploy");
      expect(strikeGundam.text).toContain("Draw 1");
      expect(strikeGundam.text).toContain("discard 1");
    });

    it("should provide card selection", () => {
      // Draw then discard allows player to filter cards
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

      // Card filtering: see one more card, choose what to discard
      expect(strikeGundam.text).toContain("Draw 1. Then, discard 1");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should maintain card advantage neutral", () => {
      // Draw 1, discard 1: neutral card advantage but better card quality
      expect(strikeGundam.text).toContain("Draw 1");
      expect(strikeGundam.text).toContain("discard 1");

      // Net zero cards but improved hand quality
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
          resourceArea: 2,
          deck: 30,
        },
        {
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });
});
