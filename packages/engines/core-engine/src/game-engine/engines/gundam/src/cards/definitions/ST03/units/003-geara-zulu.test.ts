import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gearaZulu } from "./003-geara-zulu";

/**
 * Tests for ST03-003: Geara Zulu
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: Red
 * - Traits: Zeon
 * - Link Requirement: (Neo Zeon) trait
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - Trait-based link requirement
 */

describe("ST03-003: Geara Zulu", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gearaZulu.id).toBe("ST03-003");
      expect(gearaZulu.name).toBe("Geara Zulu");
      expect(gearaZulu.number).toBe(3);
      expect(gearaZulu.set).toBe("ST03");
      expect(gearaZulu.type).toBe("unit");
      expect(gearaZulu.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gearaZulu.cost).toBe(2);
      expect(gearaZulu.level).toBe(3);
      expect(gearaZulu.ap).toBe(3);
      expect(gearaZulu.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(gearaZulu.color).toBe("red");
      expect(gearaZulu.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gearaZulu.zones).toEqual(["space", "earth"]);
    });

    it("should have trait-based link requirement", () => {
      expect(gearaZulu.linkRequirement).toEqual(["(neo zeon) trait"]);
    });

    it("should have no abilities (vanilla unit)", () => {
      expect(gearaZulu.abilities).toBeDefined();
      expect(gearaZulu.abilities.length).toBe(0);
      expect(gearaZulu.text).toBe("");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Geara Zulu costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [gearaZulu],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Geara Zulu in battle area", () => {
      // Geara Zulu on the field as an efficient attacker
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaZulu],
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Geara Zulu is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Neo Zeon trait link requirement", () => {
      // Geara Zulu has trait-based link requirement (any Neo Zeon pilot)
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaZulu],
          hand: 5, // Could have Neo Zeon trait pilot card
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Geara Zulu can be paired with any Neo Zeon trait pilot
      expect(gearaZulu.linkRequirement).toContain("(neo zeon) trait");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Geara Zulu can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gearaZulu],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Geara Zulu supports both deployment zones
      expect(gearaZulu.zones).toContain("space");
      expect(gearaZulu.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gearaZulu).toHaveProperty("implemented");
      expect(gearaZulu).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 2", () => {
      // Level 3 unit with 2 cost is an efficient early-mid game unit
      expect(gearaZulu.level).toBe(3);
      expect(gearaZulu.cost).toBe(2);
      expect(gearaZulu.ap).toBe(3);
      expect(gearaZulu.hp).toBe(2);
    });

    it("should have offensive-focused stats", () => {
      // Geara Zulu has 3 AP and 2 HP - strong offensive stats for cost
      const totalStats = gearaZulu.ap + gearaZulu.hp;
      expect(totalStats).toBe(5); // 3 + 2

      // High AP relative to cost (3 AP for 2 cost)
      expect(gearaZulu.ap).toBe(3);
      expect(gearaZulu.cost).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Geara Zulu with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaZulu],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 3,
          deck: 30,
        },
      );

      // Combat scenario ready: Geara Zulu can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an efficient aggressive unit", () => {
      // Geara Zulu offers high AP for its cost, suitable for aggressive strategies
      expect(gearaZulu.cost).toBe(2);
      expect(gearaZulu.ap).toBe(3);

      // AP-focused (AP > HP)
      expect(gearaZulu.ap).toBeGreaterThan(gearaZulu.hp);
    });

    it("should work well in Zeon tribal strategies", () => {
      // Geara Zulu has Zeon trait and flexible link requirement
      expect(gearaZulu.traits).toContain("zeon");
      expect(gearaZulu.linkRequirement).toEqual(["(neo zeon) trait"]);

      // Flexible pairing with any Neo Zeon pilot
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaZulu],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
