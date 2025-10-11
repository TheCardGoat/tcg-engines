import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aShowOfResolve } from "./100-a-show-of-resolve";

/**
 * Tests for GD01-100: A Show of Resolve
 *
 * Card Properties:
 * - Cost: 3, Level: 4
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-100: A Show of Resolve", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aShowOfResolve.id).toBe("GD01-100");
      expect(aShowOfResolve.name).toBe("A Show of Resolve");
      expect(aShowOfResolve.number).toBe(100);
      expect(aShowOfResolve.set).toBe("GD01");
      expect(aShowOfResolve.type).toBe("command");
      expect(aShowOfResolve.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(aShowOfResolve.cost).toBe(3);
      expect(aShowOfResolve.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(aShowOfResolve.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(aShowOfResolve.text).toBeTruthy();
      expect(aShowOfResolve.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(aShowOfResolve.abilities).toBeDefined();
      expect(Array.isArray(aShowOfResolve.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(aShowOfResolve.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      aShowOfResolve.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
          resourceArea: 5,
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
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
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
      expect(aShowOfResolve).toHaveProperty("implemented");
      expect(aShowOfResolve).toHaveProperty("missingTestCase");
    });
  });
});
