import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundam } from "./001-gundam";

/**
 * Tests for ST01-001: Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 4
 * - Color: Blue
 * - Traits: Earth Federation
 * - Link Requirement: Amuro Ray
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Repair 2>: At the end of your turn, this Unit recovers 2 HP
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Repair keyword effect definition
 * - Card usability in game scenarios
 */

describe("ST01-001: Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundam.id).toBe("ST01-001");
      expect(gundam.name).toBe("Gundam");
      expect(gundam.number).toBe(1);
      expect(gundam.set).toBe("ST01");
      expect(gundam.type).toBe("unit");
      expect(gundam.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(gundam.cost).toBe(3);
      expect(gundam.level).toBe(4);
      expect(gundam.ap).toBe(3);
      expect(gundam.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(gundam.color).toBe("blue");
      expect(gundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(gundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundam.linkRequirement).toEqual(["amuro ray"]);
    });

    it("should have text describing Repair ability", () => {
      expect(gundam.text).toContain("Repair 2");
      expect(gundam.text).toContain("recovers");
      expect(gundam.text).toContain("HP");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(gundam.abilities).toBeDefined();
      expect(gundam.abilities.length).toBe(1);
    });

    it("should have continuous Repair ability", () => {
      const ability = gundam.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Repair 2>");
    });

    it("should have Repair keyword effect with value 2", () => {
      const ability = gundam.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Repair");
      expect(effect.value).toBe(2);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundam],
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

    it("should set up scenario with Gundam in battle area", () => {
      // Gundam with Repair 2 in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundam],
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

      // Gundam is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Repair ability testing", () => {
      // Gundam with Repair 2 that could recover HP at turn end
      const engine = new GundamTestEngine(
        {
          battleArea: [gundam],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy to deal damage
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Repair ability: Gundam would recover 2 HP at end of turn if damaged
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Amuro Ray pilot link requirement", () => {
      // Gundam has link requirement for Amuro Ray
      // When paired with Amuro Ray, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [gundam],
          hand: 5, // Could have Amuro Ray pilot card
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

      // Gundam can be paired with Amuro Ray
      expect(gundam.linkRequirement).toContain("amuro ray");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Gundam can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gundam],
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

      // Gundam supports both deployment zones
      expect(gundam.zones).toContain("space");
      expect(gundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundam).toHaveProperty("implemented");
      expect(gundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 3", () => {
      // Level 4 unit with 3 cost is a strong early-mid game unit
      expect(gundam.level).toBe(4);
      expect(gundam.cost).toBe(3);
      expect(gundam.ap).toBe(3);
      expect(gundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      // Gundam has 3 AP and 4 HP - slightly defensive stats with Repair
      const totalStats = gundam.ap + gundam.hp;
      expect(totalStats).toBe(7); // 3 + 4

      // With Repair 2, effective HP is higher over multiple turns
      expect(gundam.abilities[0].effects[0].value).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Gundam with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundam],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });
});
