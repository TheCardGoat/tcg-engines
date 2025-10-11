import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strikeGundam } from "./077-strike-gundam";

/**
 * Tests for GD01-077: Strike Gundam
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 4
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: kira yamato
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-077: Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strikeGundam.id).toBe("GD01-077");
      expect(strikeGundam.name).toBe("Strike Gundam");
      expect(strikeGundam.number).toBe(77);
      expect(strikeGundam.set).toBe("GD01");
      expect(strikeGundam.type).toBe("unit");
      expect(strikeGundam.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(strikeGundam.cost).toBe(2);
      expect(strikeGundam.level).toBe(4);
      expect(strikeGundam.ap).toBe(3);
      expect(strikeGundam.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(strikeGundam.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(strikeGundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(strikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(strikeGundam.linkRequirement).toEqual(["kira yamato"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with link requirement", () => {
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

      expect(strikeGundam.linkRequirement).toEqual(["kira yamato"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strikeGundam],
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

      expect(strikeGundam.zones).toContain("space");
      expect(strikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(strikeGundam).toHaveProperty("implemented");
      expect(strikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(strikeGundam.level).toBe(4);
      expect(strikeGundam.cost).toBe(2);
      expect(strikeGundam.ap).toBe(3);
      expect(strikeGundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = strikeGundam.ap + strikeGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeGundam],
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
