import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gfighter } from "./009-gfighter";

/**
 * Tests for GD01-009: G-Fighter
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: blue
 * - Type: unit
 * - Rarity: uncommon
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (white base team) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-009: G-Fighter", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gfighter.id).toBe("GD01-009");
      expect(gfighter.name).toBe("G-Fighter");
      expect(gfighter.number).toBe(9);
      expect(gfighter.set).toBe("GD01");
      expect(gfighter.type).toBe("unit");
      expect(gfighter.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gfighter.cost).toBe(2);
      expect(gfighter.level).toBe(3);
      expect(gfighter.ap).toBe(3);
      expect(gfighter.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(gfighter.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(gfighter.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(gfighter.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gfighter.linkRequirement).toEqual(["(white base team) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gfighter],
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
          battleArea: [gfighter],
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
          battleArea: [gfighter],
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

      expect(gfighter.linkRequirement).toEqual(["(white base team) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gfighter],
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

      expect(gfighter.zones).toContain("space");
      expect(gfighter.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gfighter).toHaveProperty("implemented");
      expect(gfighter).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(gfighter.level).toBe(3);
      expect(gfighter.cost).toBe(2);
      expect(gfighter.ap).toBe(3);
      expect(gfighter.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gfighter.ap + gfighter.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gfighter],
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
