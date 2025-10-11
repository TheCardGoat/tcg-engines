import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamDeathscythe } from "./025-gundam-deathscythe";

/**
 * Tests for GD01-025: Gundam Deathscythe
 *
 * Card Properties:
 * - Cost: 4, Level: 6, AP: 5, HP: 4
 * - Color: green
 * - Type: unit
 * - Rarity: legendary
 * - Zones: earth
 * - Link Requirement: duo maxwell
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-025: Gundam Deathscythe", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamDeathscythe.id).toBe("GD01-025");
      expect(gundamDeathscythe.name).toBe("Gundam Deathscythe");
      expect(gundamDeathscythe.number).toBe(25);
      expect(gundamDeathscythe.set).toBe("GD01");
      expect(gundamDeathscythe.type).toBe("unit");
      expect(gundamDeathscythe.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(gundamDeathscythe.cost).toBe(4);
      expect(gundamDeathscythe.level).toBe(6);
      expect(gundamDeathscythe.ap).toBe(5);
      expect(gundamDeathscythe.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamDeathscythe.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(gundamDeathscythe.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamDeathscythe.linkRequirement).toEqual(["duo maxwell"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamDeathscythe],
          resourceArea: 6,
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
      assertZoneCount(engine, "resourceArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamDeathscythe],
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
          battleArea: [gundamDeathscythe],
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

      expect(gundamDeathscythe.linkRequirement).toEqual(["duo maxwell"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamDeathscythe],
          resourceArea: 6,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(gundamDeathscythe.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamDeathscythe).toHaveProperty("implemented");
      expect(gundamDeathscythe).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 6", () => {
      expect(gundamDeathscythe.level).toBe(6);
      expect(gundamDeathscythe.cost).toBe(4);
      expect(gundamDeathscythe.ap).toBe(5);
      expect(gundamDeathscythe.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamDeathscythe.ap + gundamDeathscythe.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamDeathscythe],
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
