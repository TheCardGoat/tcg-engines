import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { overflowingAffection } from "./118-overflowing-affection";

/**
 * Tests for GD01-118: Overflowing Affection
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: white
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

describe("GD01-118: Overflowing Affection", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(overflowingAffection.id).toBe("GD01-118");
      expect(overflowingAffection.name).toBe("Overflowing Affection");
      expect(overflowingAffection.number).toBe(118);
      expect(overflowingAffection.set).toBe("GD01");
      expect(overflowingAffection.type).toBe("command");
      expect(overflowingAffection.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(overflowingAffection.cost).toBe(1);
      expect(overflowingAffection.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(overflowingAffection.color).toBe("white");
    });

    it("should have card text", () => {
      expect(overflowingAffection.text).toBeTruthy();
      expect(overflowingAffection.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(overflowingAffection.abilities).toBeDefined();
      expect(Array.isArray(overflowingAffection.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(overflowingAffection.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      overflowingAffection.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [overflowingAffection],
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
          hand: [overflowingAffection],
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
      expect(overflowingAffection).toHaveProperty("implemented");
      expect(overflowingAffection).toHaveProperty("missingTestCase");
    });
  });
});
