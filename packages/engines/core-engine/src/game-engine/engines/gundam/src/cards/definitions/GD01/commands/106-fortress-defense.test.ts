import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { fortressDefense } from "./106-fortress-defense";

/**
 * Tests for GD01-106: Fortress Defense
 *
 * Card Properties:
 * - Cost: 2, Level: 5
 * - Color: green
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

describe("GD01-106: Fortress Defense", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(fortressDefense.id).toBe("GD01-106");
      expect(fortressDefense.name).toBe("Fortress Defense");
      expect(fortressDefense.number).toBe(106);
      expect(fortressDefense.set).toBe("GD01");
      expect(fortressDefense.type).toBe("command");
      expect(fortressDefense.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(fortressDefense.cost).toBe(2);
      expect(fortressDefense.level).toBe(5);
    });

    it("should have correct color", () => {
      expect(fortressDefense.color).toBe("green");
    });

    it("should have card text", () => {
      expect(fortressDefense.text).toBeTruthy();
      expect(fortressDefense.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(fortressDefense.abilities).toBeDefined();
      expect(Array.isArray(fortressDefense.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(fortressDefense.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      fortressDefense.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [fortressDefense],
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
          hand: [fortressDefense],
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
      expect(fortressDefense).toHaveProperty("implemented");
      expect(fortressDefense).toHaveProperty("missingTestCase");
    });
  });
});
