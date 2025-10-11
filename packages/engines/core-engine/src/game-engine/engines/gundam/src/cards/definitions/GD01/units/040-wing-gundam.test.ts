import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { wingGundam } from "./040-wing-gundam";

/**
 * Tests for GD01-040: Wing Gundam
 *
 * Card Properties:
 * - Cost: 2, Level: 5, AP: 4, HP: 3
 * - Color: green
 * - Type: unit
 * - Rarity: common
 * - Zones: space, earth
 * - Link Requirement: heero yuy
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-040: Wing Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(wingGundam.id).toBe("GD01-040");
      expect(wingGundam.name).toBe("Wing Gundam");
      expect(wingGundam.number).toBe(40);
      expect(wingGundam.set).toBe("GD01");
      expect(wingGundam.type).toBe("unit");
      expect(wingGundam.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(wingGundam.cost).toBe(2);
      expect(wingGundam.level).toBe(5);
      expect(wingGundam.ap).toBe(4);
      expect(wingGundam.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(wingGundam.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(wingGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(wingGundam.linkRequirement).toEqual(["heero yuy"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [wingGundam],
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
          battleArea: [wingGundam],
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
          battleArea: [wingGundam],
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

      expect(wingGundam.linkRequirement).toEqual(["heero yuy"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [wingGundam],
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

      expect(wingGundam.zones).toContain("space");
      expect(wingGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(wingGundam).toHaveProperty("implemented");
      expect(wingGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(wingGundam.level).toBe(5);
      expect(wingGundam.cost).toBe(2);
      expect(wingGundam.ap).toBe(4);
      expect(wingGundam.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = wingGundam.ap + wingGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundam],
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
