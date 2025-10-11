import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { rasid039sOrders } from "./110-rasid039s-orders";

/**
 * Tests for GD01-110: Rasid&#039;s Orders
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: green
 * - Type: triggered
 * - Rarity: common
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-110: Rasid&#039;s Orders", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(rasid039sOrders.id).toBe("GD01-110");
      expect(rasid039sOrders.name).toBe("Rasid&#039;s Orders");
      expect(rasid039sOrders.number).toBe(110);
      expect(rasid039sOrders.set).toBe("GD01");
      expect(rasid039sOrders.type).toBe("command");
      expect(rasid039sOrders.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(rasid039sOrders.cost).toBe(1);
      expect(rasid039sOrders.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(rasid039sOrders.color).toBe("green");
    });

    it("should have card text", () => {
      expect(rasid039sOrders.text).toBeTruthy();
      expect(rasid039sOrders.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(rasid039sOrders.abilities).toBeDefined();
      expect(Array.isArray(rasid039sOrders.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(rasid039sOrders.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      rasid039sOrders.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [rasid039sOrders],
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
          hand: [rasid039sOrders],
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
      expect(rasid039sOrders).toHaveProperty("implemented");
      expect(rasid039sOrders).toHaveProperty("missingTestCase");
    });
  });
});
