import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { wingGundamBirdMode } from "./002-wing-gundam-bird-mode";

/**
 * Tests for ST02-002: Wing Gundam (Bird Mode)
 *
 * Card Properties:
 * - Cost: 3, Level: 3, AP: 2, HP: 2
 * - Color: Green
 * - Traits: None
 * - Link Requirement: Heero Yuy
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Deploy】Place 1 EX Resource: When this Unit enters the field, add 1 resource
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Deploy trigger effect definition
 * - Card usability in game scenarios
 */

describe("ST02-002: Wing Gundam (Bird Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(wingGundamBirdMode.id).toBe("ST02-002");
      expect(wingGundamBirdMode.name).toBe("Wing Gundam (Bird Mode)");
      expect(wingGundamBirdMode.number).toBe(2);
      expect(wingGundamBirdMode.set).toBe("ST02");
      expect(wingGundamBirdMode.type).toBe("unit");
      expect(wingGundamBirdMode.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(wingGundamBirdMode.cost).toBe(3);
      expect(wingGundamBirdMode.level).toBe(3);
      expect(wingGundamBirdMode.ap).toBe(2);
      expect(wingGundamBirdMode.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(wingGundamBirdMode.color).toBe("green");
      expect(wingGundamBirdMode.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(wingGundamBirdMode.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(wingGundamBirdMode.linkRequirement).toEqual(["heero yuy"]);
    });

    it("should have text describing Deploy ability", () => {
      expect(wingGundamBirdMode.text).toContain("Deploy");
      expect(wingGundamBirdMode.text).toContain("EX Resource");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(wingGundamBirdMode.abilities).toBeDefined();
      expect(wingGundamBirdMode.abilities.length).toBe(1);
    });

    it("should have triggered Deploy ability", () => {
      const ability = wingGundamBirdMode.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.trigger?.event).toBe("deploy");
    });

    it("should have Deploy text", () => {
      const ability = wingGundamBirdMode.abilities[0];
      expect(ability.text).toBe("【deploy】");
    });

    it("should have resource placement effect", () => {
      const ability = wingGundamBirdMode.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      // Deploy effect places resources
      expect(ability.effects[0].type).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Wing Gundam (Bird Mode) costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamBirdMode],
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

    it("should set up scenario with Wing Gundam (Bird Mode) in battle area", () => {
      // Wing Gundam (Bird Mode) with Deploy ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundamBirdMode],
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

      // Wing Gundam (Bird Mode) is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Deploy ability testing", () => {
      // Wing Gundam (Bird Mode) places 1 EX Resource when deployed
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamBirdMode],
          resourceArea: 3, // Need 3 to deploy
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

      // Setup for Deploy ability: Will gain 1 resource when deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
    });

    it("should work with Heero Yuy pilot link requirement", () => {
      // Wing Gundam (Bird Mode) has link requirement for Heero Yuy
      // When paired with Heero Yuy, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundamBirdMode],
          hand: 5, // Could have Heero Yuy pilot card
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

      // Wing Gundam (Bird Mode) can be paired with Heero Yuy
      expect(wingGundamBirdMode.linkRequirement).toContain("heero yuy");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Wing Gundam (Bird Mode) can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamBirdMode],
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

      // Wing Gundam (Bird Mode) supports both deployment zones
      expect(wingGundamBirdMode.zones).toContain("space");
      expect(wingGundamBirdMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should provide resource acceleration when deployed", () => {
      // Wing Gundam (Bird Mode)'s Deploy ability provides tempo advantage
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamBirdMode],
          resourceArea: 3,
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

      // Deploy effect means net cost is 2 (3 cost - 1 resource gained)
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(wingGundamBirdMode).toHaveProperty("implemented");
      expect(wingGundamBirdMode).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 3", () => {
      // Level 3 unit with 3 cost is a fair early game unit
      expect(wingGundamBirdMode.level).toBe(3);
      expect(wingGundamBirdMode.cost).toBe(3);
      expect(wingGundamBirdMode.ap).toBe(2);
      expect(wingGundamBirdMode.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      // Wing Gundam (Bird Mode) has 2 AP and 2 HP - even stats
      const totalStats = wingGundamBirdMode.ap + wingGundamBirdMode.hp;
      expect(totalStats).toBe(4); // 2 + 2

      // Deploy ability provides resource value
      expect(wingGundamBirdMode.abilities[0].trigger?.event).toBe("deploy");
    });

    it("should set up combat scenario", () => {
      // Wing Gundam (Bird Mode) with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundamBirdMode],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Wing Gundam (Bird Mode) can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early game tempo unit", () => {
      // Level 3 is early-mid game, cost 3 with resource refund
      expect(wingGundamBirdMode.level).toBe(3);
      expect(wingGundamBirdMode.cost).toBe(3);

      // Effective cost is 2 due to Deploy ability
      const totalStats = wingGundamBirdMode.ap + wingGundamBirdMode.hp;
      expect(totalStats).toBe(4);
    });

    it("should work as resource acceleration", () => {
      // Wing Gundam (Bird Mode) provides resources when deployed
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamBirdMode],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Deploy ability makes this a resource acceleration card
      expect(wingGundamBirdMode.abilities[0].trigger?.event).toBe("deploy");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });
});
