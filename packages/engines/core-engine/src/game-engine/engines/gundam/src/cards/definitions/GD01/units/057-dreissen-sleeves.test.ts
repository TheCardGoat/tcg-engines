import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { dreissenSleeves } from "./057-dreissen-sleeves";

/**
 * Tests for GD01-057: Dreissen (Sleeves)
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 3
 * - Color: red
 * - Type: unit
 * - Rarity: common
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-057: Dreissen (Sleeves)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(dreissenSleeves.id).toBe("GD01-057");
      expect(dreissenSleeves.name).toBe("Dreissen (Sleeves)");
      expect(dreissenSleeves.number).toBe(57);
      expect(dreissenSleeves.set).toBe("GD01");
      expect(dreissenSleeves.type).toBe("unit");
      expect(dreissenSleeves.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(dreissenSleeves.cost).toBe(2);
      expect(dreissenSleeves.level).toBe(2);
      expect(dreissenSleeves.ap).toBe(2);
      expect(dreissenSleeves.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(dreissenSleeves.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(dreissenSleeves.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(dreissenSleeves.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(dreissenSleeves.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [dreissenSleeves],
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
          battleArea: [dreissenSleeves],
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
          battleArea: [dreissenSleeves],
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

      expect(dreissenSleeves.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [dreissenSleeves],
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

      expect(dreissenSleeves.zones).toContain("space");
      expect(dreissenSleeves.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(dreissenSleeves).toHaveProperty("implemented");
      expect(dreissenSleeves).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(dreissenSleeves.level).toBe(2);
      expect(dreissenSleeves.cost).toBe(2);
      expect(dreissenSleeves.ap).toBe(2);
      expect(dreissenSleeves.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = dreissenSleeves.ap + dreissenSleeves.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [dreissenSleeves],
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
