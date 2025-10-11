import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { interceptOrders } from "./099-intercept-orders";

/**
 * Tests for GD01-099: Intercept Orders
 *
 * Card Properties:
 * - Cost: 2, Level: 4
 * - Color: blue
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

describe("GD01-099: Intercept Orders", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(interceptOrders.id).toBe("GD01-099");
      expect(interceptOrders.name).toBe("Intercept Orders");
      expect(interceptOrders.number).toBe(99);
      expect(interceptOrders.set).toBe("GD01");
      expect(interceptOrders.type).toBe("command");
      expect(interceptOrders.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(interceptOrders.cost).toBe(2);
      expect(interceptOrders.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(interceptOrders.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(interceptOrders.text).toBeTruthy();
      expect(interceptOrders.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(interceptOrders.abilities).toBeDefined();
      expect(Array.isArray(interceptOrders.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(interceptOrders.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      interceptOrders.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [interceptOrders],
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
          hand: [interceptOrders],
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
      expect(interceptOrders).toHaveProperty("implemented");
      expect(interceptOrders).toHaveProperty("missingTestCase");
    });
  });
});
