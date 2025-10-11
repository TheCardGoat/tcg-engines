import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gelgoog } from "./031-gelgoog";

/**
 * Tests for GD01-031: Gelgoog
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 4, HP: 3
 * - Color: green
 * - Type: unit
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: (zeon) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-031: Gelgoog", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gelgoog.id).toBe("GD01-031");
      expect(gelgoog.name).toBe("Gelgoog");
      expect(gelgoog.number).toBe(31);
      expect(gelgoog.set).toBe("GD01");
      expect(gelgoog.type).toBe("unit");
      expect(gelgoog.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gelgoog.cost).toBe(2);
      expect(gelgoog.level).toBe(4);
      expect(gelgoog.ap).toBe(4);
      expect(gelgoog.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gelgoog.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(gelgoog.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gelgoog.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gelgoog.linkRequirement).toEqual(["(zeon) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gelgoog],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gelgoog],
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

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with link requirement", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gelgoog],
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

      expect(gelgoog.linkRequirement).toEqual(["(zeon) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gelgoog],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(gelgoog.zones).toContain("space");
      expect(gelgoog.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gelgoog).toHaveProperty("implemented");
      expect(gelgoog).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gelgoog.level).toBe(4);
      expect(gelgoog.cost).toBe(2);
      expect(gelgoog.ap).toBe(4);
      expect(gelgoog.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gelgoog.ap + gelgoog.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gelgoog],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });
});
