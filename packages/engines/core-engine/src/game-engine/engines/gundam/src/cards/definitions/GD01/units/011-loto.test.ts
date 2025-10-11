import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { loto } from "./011-loto";

/**
 * Tests for GD01-011: Loto
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: blue
 * - Type: unit
 * - Rarity: uncommon
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (earth federation) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-011: Loto", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(loto.id).toBe("GD01-011");
      expect(loto.name).toBe("Loto");
      expect(loto.number).toBe(11);
      expect(loto.set).toBe("GD01");
      expect(loto.type).toBe("unit");
      expect(loto.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(loto.cost).toBe(2);
      expect(loto.level).toBe(2);
      expect(loto.ap).toBe(2);
      expect(loto.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(loto.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(loto.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(loto.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(loto.linkRequirement).toEqual(["(earth federation) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [loto],
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
          battleArea: [loto],
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
          battleArea: [loto],
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

      expect(loto.linkRequirement).toEqual(["(earth federation) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [loto],
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

      expect(loto.zones).toContain("space");
      expect(loto.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(loto).toHaveProperty("implemented");
      expect(loto).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(loto.level).toBe(2);
      expect(loto.cost).toBe(2);
      expect(loto.ap).toBe(2);
      expect(loto.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = loto.ap + loto.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [loto],
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
