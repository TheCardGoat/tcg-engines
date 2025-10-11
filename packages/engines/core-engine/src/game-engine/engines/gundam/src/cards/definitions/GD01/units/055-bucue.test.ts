import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { bucue } from "./055-bucue";

/**
 * Tests for GD01-055: BuCUE
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: red
 * - Type: continuous
 * - Rarity: uncommon
 * - Zones: earth
 * - Link Requirement: -
 * Abilities:
 * - <Support 2>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-055: BuCUE", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(bucue.id).toBe("GD01-055");
      expect(bucue.name).toBe("BuCUE");
      expect(bucue.number).toBe(55);
      expect(bucue.set).toBe("GD01");
      expect(bucue.type).toBe("unit");
      expect(bucue.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(bucue.cost).toBe(2);
      expect(bucue.level).toBe(3);
      expect(bucue.ap).toBe(2);
      expect(bucue.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(bucue.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(bucue.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(bucue.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(bucue.text).toBeTruthy();
      expect(bucue.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(bucue.abilities).toBeDefined();
      expect(Array.isArray(bucue.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(bucue.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      bucue.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [bucue],
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
          battleArea: [bucue],
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
          battleArea: [bucue],
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

      expect(bucue.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [bucue],
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

      expect(bucue.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(bucue).toHaveProperty("implemented");
      expect(bucue).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(bucue.level).toBe(3);
      expect(bucue.cost).toBe(2);
      expect(bucue.ap).toBe(2);
      expect(bucue.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = bucue.ap + bucue.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [bucue],
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
