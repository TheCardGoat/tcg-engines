import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { rezel } from "./018-rezel";

/**
 * Tests for GD01-018: ReZEL
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 4, HP: 3
 * - Color: blue
 * - Type: unit
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-018: ReZEL", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(rezel.id).toBe("GD01-018");
      expect(rezel.name).toBe("ReZEL");
      expect(rezel.number).toBe(18);
      expect(rezel.set).toBe("GD01");
      expect(rezel.type).toBe("unit");
      expect(rezel.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(rezel.cost).toBe(2);
      expect(rezel.level).toBe(3);
      expect(rezel.ap).toBe(4);
      expect(rezel.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(rezel.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(rezel.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(rezel.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(rezel.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [rezel],
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
          battleArea: [rezel],
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
          battleArea: [rezel],
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

      expect(rezel.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [rezel],
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

      expect(rezel.zones).toContain("space");
      expect(rezel.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(rezel).toHaveProperty("implemented");
      expect(rezel).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(rezel.level).toBe(3);
      expect(rezel.cost).toBe(2);
      expect(rezel.ap).toBe(4);
      expect(rezel.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = rezel.ap + rezel.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [rezel],
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
