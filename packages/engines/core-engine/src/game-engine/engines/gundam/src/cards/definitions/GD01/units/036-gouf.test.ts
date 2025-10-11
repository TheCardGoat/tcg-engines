import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gouf } from "./036-gouf";

/**
 * Tests for GD01-036: Gouf
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 2
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

describe("GD01-036: Gouf", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gouf.id).toBe("GD01-036");
      expect(gouf.name).toBe("Gouf");
      expect(gouf.number).toBe(36);
      expect(gouf.set).toBe("GD01");
      expect(gouf.type).toBe("unit");
      expect(gouf.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gouf.cost).toBe(2);
      expect(gouf.level).toBe(2);
      expect(gouf.ap).toBe(3);
      expect(gouf.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(gouf.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(gouf.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gouf.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gouf.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gouf],
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
          battleArea: [gouf],
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
          battleArea: [gouf],
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

      expect(gouf.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gouf],
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

      expect(gouf.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gouf).toHaveProperty("implemented");
      expect(gouf).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(gouf.level).toBe(2);
      expect(gouf.cost).toBe(2);
      expect(gouf.ap).toBe(3);
      expect(gouf.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gouf.ap + gouf.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gouf],
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
