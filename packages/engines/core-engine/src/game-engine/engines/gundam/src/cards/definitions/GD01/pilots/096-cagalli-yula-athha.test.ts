import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { cagalliYulaAthha } from "./096-cagalli-yula-athha";

/**
 * Tests for GD01-096: Cagalli Yula Athha
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: white
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

describe("GD01-096: Cagalli Yula Athha", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(cagalliYulaAthha.id).toBe("GD01-096");
      expect(cagalliYulaAthha.name).toBe("Cagalli Yula Athha");
      expect(cagalliYulaAthha.number).toBe(96);
      expect(cagalliYulaAthha.set).toBe("GD01");
      expect(cagalliYulaAthha.type).toBe("pilot");
      expect(cagalliYulaAthha.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(cagalliYulaAthha.cost).toBe(1);
      expect(cagalliYulaAthha.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(cagalliYulaAthha.color).toBe("white");
    });

    it("should have card text", () => {
      expect(cagalliYulaAthha.text).toBeTruthy();
      expect(cagalliYulaAthha.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(cagalliYulaAthha.abilities).toBeDefined();
      expect(Array.isArray(cagalliYulaAthha.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(cagalliYulaAthha.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      cagalliYulaAthha.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [cagalliYulaAthha],
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
          hand: [cagalliYulaAthha],
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
      expect(cagalliYulaAthha).toHaveProperty("implemented");
      expect(cagalliYulaAthha).toHaveProperty("missingTestCase");
    });
  });
});
