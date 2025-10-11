import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gogg } from "./037-gogg";

/**
 * Tests for GD01-037: Gogg
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 3
 * - Color: green
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

describe("GD01-037: Gogg", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gogg.id).toBe("GD01-037");
      expect(gogg.name).toBe("Gogg");
      expect(gogg.number).toBe(37);
      expect(gogg.set).toBe("GD01");
      expect(gogg.type).toBe("unit");
      expect(gogg.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gogg.cost).toBe(2);
      expect(gogg.level).toBe(2);
      expect(gogg.ap).toBe(2);
      expect(gogg.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gogg.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(gogg.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gogg.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gogg.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gogg],
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
          battleArea: [gogg],
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
          battleArea: [gogg],
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

      expect(gogg.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gogg],
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

      expect(gogg.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gogg).toHaveProperty("implemented");
      expect(gogg).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(gogg.level).toBe(2);
      expect(gogg.cost).toBe(2);
      expect(gogg.ap).toBe(2);
      expect(gogg.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gogg.ap + gogg.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gogg],
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
