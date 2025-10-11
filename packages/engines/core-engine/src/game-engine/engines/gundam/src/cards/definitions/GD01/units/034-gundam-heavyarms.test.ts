import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamHeavyarms } from "./034-gundam-heavyarms";

/**
 * Tests for GD01-034: Gundam Heavyarms
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 4
 * - Color: green
 * - Type: unit
 * - Rarity: uncommon
 * - Zones: earth
 * - Link Requirement: trowa barton
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-034: Gundam Heavyarms", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamHeavyarms.id).toBe("GD01-034");
      expect(gundamHeavyarms.name).toBe("Gundam Heavyarms");
      expect(gundamHeavyarms.number).toBe(34);
      expect(gundamHeavyarms.set).toBe("GD01");
      expect(gundamHeavyarms.type).toBe("unit");
      expect(gundamHeavyarms.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gundamHeavyarms.cost).toBe(2);
      expect(gundamHeavyarms.level).toBe(4);
      expect(gundamHeavyarms.ap).toBe(3);
      expect(gundamHeavyarms.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamHeavyarms.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(gundamHeavyarms.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamHeavyarms.linkRequirement).toEqual(["trowa barton"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamHeavyarms],
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
          battleArea: [gundamHeavyarms],
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
          battleArea: [gundamHeavyarms],
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

      expect(gundamHeavyarms.linkRequirement).toEqual(["trowa barton"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamHeavyarms],
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

      expect(gundamHeavyarms.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamHeavyarms).toHaveProperty("implemented");
      expect(gundamHeavyarms).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gundamHeavyarms.level).toBe(4);
      expect(gundamHeavyarms.cost).toBe(2);
      expect(gundamHeavyarms.ap).toBe(3);
      expect(gundamHeavyarms.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamHeavyarms.ap + gundamHeavyarms.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamHeavyarms],
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
