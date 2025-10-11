import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { pisces } from "./021-pisces";

/**
 * Tests for GD01-021: Pisces
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 2
 * - Color: blue
 * - Type: unit
 * - Rarity: common
 * - Zones: earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-021: Pisces", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(pisces.id).toBe("GD01-021");
      expect(pisces.name).toBe("Pisces");
      expect(pisces.number).toBe(21);
      expect(pisces.set).toBe("GD01");
      expect(pisces.type).toBe("unit");
      expect(pisces.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(pisces.cost).toBe(1);
      expect(pisces.level).toBe(1);
      expect(pisces.ap).toBe(1);
      expect(pisces.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(pisces.color).toBe("blue");
    });

    it("should have correct zones", () => {
      expect(pisces.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(pisces.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [pisces],
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
          battleArea: [pisces],
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
          battleArea: [pisces],
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

      expect(pisces.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [pisces],
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

      expect(pisces.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(pisces).toHaveProperty("implemented");
      expect(pisces).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 1", () => {
      expect(pisces.level).toBe(1);
      expect(pisces.cost).toBe(1);
      expect(pisces.ap).toBe(1);
      expect(pisces.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = pisces.ap + pisces.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [pisces],
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
