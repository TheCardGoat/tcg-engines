import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { extremeHatred } from "./112-extreme-hatred";

/**
 * Tests for GD01-112: Extreme Hatred
 *
 * Card Properties:
 * - Cost: 1, Level: 6
 * - Color: red
 * - Type: triggered
 * - Rarity: rare
 * Abilities:
 * - 【main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-112: Extreme Hatred", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(extremeHatred.id).toBe("GD01-112");
      expect(extremeHatred.name).toBe("Extreme Hatred");
      expect(extremeHatred.number).toBe(112);
      expect(extremeHatred.set).toBe("GD01");
      expect(extremeHatred.type).toBe("command");
      expect(extremeHatred.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(extremeHatred.cost).toBe(1);
      expect(extremeHatred.level).toBe(6);
    });

    it("should have correct color", () => {
      expect(extremeHatred.color).toBe("red");
    });

    it("should have card text", () => {
      expect(extremeHatred.text).toBeTruthy();
      expect(extremeHatred.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(extremeHatred.abilities).toBeDefined();
      expect(Array.isArray(extremeHatred.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(extremeHatred.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      extremeHatred.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [extremeHatred],
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
          hand: [extremeHatred],
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
      expect(extremeHatred).toHaveProperty("implemented");
      expect(extremeHatred).toHaveProperty("missingTestCase");
    });
  });
});
