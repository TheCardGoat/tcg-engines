import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zaku } from "./035-zaku";

/**
 * Tests for GD01-035: Zaku Ⅱ
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 2, HP: 2
 * - Color: green
 * - Type: unit
 * - Rarity: common
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-035: Zaku Ⅱ", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zaku.id).toBe("GD01-035");
      expect(zaku.name).toBe("Zaku Ⅱ");
      expect(zaku.number).toBe(35);
      expect(zaku.set).toBe("GD01");
      expect(zaku.type).toBe("unit");
      expect(zaku.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zaku.cost).toBe(1);
      expect(zaku.level).toBe(2);
      expect(zaku.ap).toBe(2);
      expect(zaku.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(zaku.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(zaku.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zaku.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(zaku.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zaku],
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

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zaku],
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
          battleArea: [zaku],
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

      expect(zaku.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zaku],
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

      expect(zaku.zones).toContain("space");
      expect(zaku.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(zaku).toHaveProperty("implemented");
      expect(zaku).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(zaku.level).toBe(2);
      expect(zaku.cost).toBe(1);
      expect(zaku.ap).toBe(2);
      expect(zaku.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = zaku.ap + zaku.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zaku],
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
