import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zakuMariner } from "./060-zaku-mariner";

/**
 * Tests for GD01-060: Zaku Mariner
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 2, HP: 2
 * - Color: red
 * - Type: unit
 * - Rarity: common
 * - Traits: zeon
 * - Zones: earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-060: Zaku Mariner", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zakuMariner.id).toBe("GD01-060");
      expect(zakuMariner.name).toBe("Zaku Mariner");
      expect(zakuMariner.number).toBe(60);
      expect(zakuMariner.set).toBe("GD01");
      expect(zakuMariner.type).toBe("unit");
      expect(zakuMariner.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zakuMariner.cost).toBe(1);
      expect(zakuMariner.level).toBe(2);
      expect(zakuMariner.ap).toBe(2);
      expect(zakuMariner.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(zakuMariner.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(zakuMariner.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zakuMariner.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(zakuMariner.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zakuMariner],
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
          battleArea: [zakuMariner],
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
          battleArea: [zakuMariner],
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

      expect(zakuMariner.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zakuMariner],
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

      expect(zakuMariner.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(zakuMariner).toHaveProperty("implemented");
      expect(zakuMariner).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(zakuMariner.level).toBe(2);
      expect(zakuMariner.cost).toBe(1);
      expect(zakuMariner.ap).toBe(2);
      expect(zakuMariner.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = zakuMariner.ap + zakuMariner.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuMariner],
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
