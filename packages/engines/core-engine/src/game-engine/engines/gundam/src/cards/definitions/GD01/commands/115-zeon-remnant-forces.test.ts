import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zeonRemnantForces } from "./115-zeon-remnant-forces";

/**
 * Tests for GD01-115: Zeon Remnant Forces
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: red
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-115: Zeon Remnant Forces", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zeonRemnantForces.id).toBe("GD01-115");
      expect(zeonRemnantForces.name).toBe("Zeon Remnant Forces");
      expect(zeonRemnantForces.number).toBe(115);
      expect(zeonRemnantForces.set).toBe("GD01");
      expect(zeonRemnantForces.type).toBe("command");
      expect(zeonRemnantForces.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(zeonRemnantForces.cost).toBe(1);
      expect(zeonRemnantForces.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(zeonRemnantForces.color).toBe("red");
    });

    it("should have card text", () => {
      expect(zeonRemnantForces.text).toBeTruthy();
      expect(zeonRemnantForces.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(zeonRemnantForces.abilities).toBeDefined();
      expect(Array.isArray(zeonRemnantForces.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(zeonRemnantForces.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      zeonRemnantForces.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zeonRemnantForces],
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
          hand: [zeonRemnantForces],
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
      expect(zeonRemnantForces).toHaveProperty("implemented");
      expect(zeonRemnantForces).toHaveProperty("missingTestCase");
    });
  });
});
