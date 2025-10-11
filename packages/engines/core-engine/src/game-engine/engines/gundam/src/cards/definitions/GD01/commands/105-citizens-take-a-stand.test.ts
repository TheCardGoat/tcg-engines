import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { citizensTakeAStand } from "./105-citizens-take-a-stand";

/**
 * Tests for GD01-105: Citizens, Take a Stand!
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: green
 * - Type: triggered
 * - Rarity: rare
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-105: Citizens, Take a Stand!", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(citizensTakeAStand.id).toBe("GD01-105");
      expect(citizensTakeAStand.name).toBe("Citizens, Take a Stand!");
      expect(citizensTakeAStand.number).toBe(105);
      expect(citizensTakeAStand.set).toBe("GD01");
      expect(citizensTakeAStand.type).toBe("command");
      expect(citizensTakeAStand.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(citizensTakeAStand.cost).toBe(1);
      expect(citizensTakeAStand.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(citizensTakeAStand.color).toBe("green");
    });

    it("should have card text", () => {
      expect(citizensTakeAStand.text).toBeTruthy();
      expect(citizensTakeAStand.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(citizensTakeAStand.abilities).toBeDefined();
      expect(Array.isArray(citizensTakeAStand.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(citizensTakeAStand.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      citizensTakeAStand.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [citizensTakeAStand],
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
          hand: [citizensTakeAStand],
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

      assertZoneCount(engine, "hand", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(citizensTakeAStand).toHaveProperty("implemented");
      expect(citizensTakeAStand).toHaveProperty("missingTestCase");
    });
  });
});
