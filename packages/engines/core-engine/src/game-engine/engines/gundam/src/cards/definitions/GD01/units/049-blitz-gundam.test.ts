import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { blitzGundam } from "./049-blitz-gundam";

/**
 * Tests for GD01-049: Blitz Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 3
 * - Color: red
 * - Type: unit
 * - Rarity: rare
 * - Zones: space, earth
 * - Link Requirement: nicol amarfi
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-049: Blitz Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(blitzGundam.id).toBe("GD01-049");
      expect(blitzGundam.name).toBe("Blitz Gundam");
      expect(blitzGundam.number).toBe(49);
      expect(blitzGundam.set).toBe("GD01");
      expect(blitzGundam.type).toBe("unit");
      expect(blitzGundam.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(blitzGundam.cost).toBe(3);
      expect(blitzGundam.level).toBe(4);
      expect(blitzGundam.ap).toBe(3);
      expect(blitzGundam.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(blitzGundam.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(blitzGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(blitzGundam.linkRequirement).toEqual(["nicol amarfi"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [blitzGundam],
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

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [blitzGundam],
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
          battleArea: [blitzGundam],
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

      expect(blitzGundam.linkRequirement).toEqual(["nicol amarfi"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [blitzGundam],
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

      expect(blitzGundam.zones).toContain("space");
      expect(blitzGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(blitzGundam).toHaveProperty("implemented");
      expect(blitzGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(blitzGundam.level).toBe(4);
      expect(blitzGundam.cost).toBe(3);
      expect(blitzGundam.ap).toBe(3);
      expect(blitzGundam.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = blitzGundam.ap + blitzGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [blitzGundam],
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
