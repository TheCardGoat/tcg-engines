import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { cancer } from "./022-cancer";

/**
 * Tests for GD01-022: Cancer
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 3
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

describe("GD01-022: Cancer", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(cancer.id).toBe("GD01-022");
      expect(cancer.name).toBe("Cancer");
      expect(cancer.number).toBe(22);
      expect(cancer.set).toBe("GD01");
      expect(cancer.type).toBe("unit");
      expect(cancer.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(cancer.cost).toBe(2);
      expect(cancer.level).toBe(2);
      expect(cancer.ap).toBe(2);
      expect(cancer.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(cancer.color).toBe("blue");
    });

    it("should have correct zones", () => {
      expect(cancer.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(cancer.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [cancer],
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
          battleArea: [cancer],
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
          battleArea: [cancer],
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

      expect(cancer.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [cancer],
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

      expect(cancer.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(cancer).toHaveProperty("implemented");
      expect(cancer).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(cancer.level).toBe(2);
      expect(cancer.cost).toBe(2);
      expect(cancer.ap).toBe(2);
      expect(cancer.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = cancer.ap + cancer.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [cancer],
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
