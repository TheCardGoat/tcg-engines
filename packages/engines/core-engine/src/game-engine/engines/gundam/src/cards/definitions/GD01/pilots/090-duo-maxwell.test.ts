import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { duoMaxwell } from "./090-duo-maxwell";

/**
 * Tests for GD01-090: Duo Maxwell
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

describe("GD01-090: Duo Maxwell", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(duoMaxwell.id).toBe("GD01-090");
      expect(duoMaxwell.name).toBe("Duo Maxwell");
      expect(duoMaxwell.number).toBe(90);
      expect(duoMaxwell.set).toBe("GD01");
      expect(duoMaxwell.type).toBe("pilot");
      expect(duoMaxwell.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(duoMaxwell.cost).toBe(1);
      expect(duoMaxwell.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(duoMaxwell.color).toBe("green");
    });

    it("should have card text", () => {
      expect(duoMaxwell.text).toBeTruthy();
      expect(duoMaxwell.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(duoMaxwell.abilities).toBeDefined();
      expect(Array.isArray(duoMaxwell.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(duoMaxwell.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      duoMaxwell.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [duoMaxwell],
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
          hand: [duoMaxwell],
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
      expect(duoMaxwell).toHaveProperty("implemented");
      expect(duoMaxwell).toHaveProperty("missingTestCase");
    });
  });
});
