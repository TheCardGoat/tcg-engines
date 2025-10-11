import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { deepDevotion } from "./101-deep-devotion";

/**
 * Tests for GD01-101: Deep Devotion
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: blue
 * - Type: triggered
 * - Rarity: rare
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-101: Deep Devotion", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(deepDevotion.id).toBe("GD01-101");
      expect(deepDevotion.name).toBe("Deep Devotion");
      expect(deepDevotion.number).toBe(101);
      expect(deepDevotion.set).toBe("GD01");
      expect(deepDevotion.type).toBe("command");
      expect(deepDevotion.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(deepDevotion.cost).toBe(1);
      expect(deepDevotion.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(deepDevotion.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(deepDevotion.text).toBeTruthy();
      expect(deepDevotion.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(deepDevotion.abilities).toBeDefined();
      expect(Array.isArray(deepDevotion.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(deepDevotion.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      deepDevotion.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [deepDevotion],
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
          hand: [deepDevotion],
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
      expect(deepDevotion).toHaveProperty("implemented");
      expect(deepDevotion).toHaveProperty("missingTestCase");
    });
  });
});
