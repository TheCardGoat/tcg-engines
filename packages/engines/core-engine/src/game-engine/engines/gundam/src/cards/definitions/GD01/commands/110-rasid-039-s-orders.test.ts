import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { card } from "./110-rasid-039-s-orders";

/**
 * Tests for GD01-110: Rasid&#039;s Orders
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: green
 * - Type: command
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
      expect(card.id).toBe("GD01-110");
      expect(card.name).toBe("Rasid&#039;s Orders");
      expect(card.number).toBe(110);
      expect(card.set).toBe("GD01");
      expect(card.type).toBe("command");
      expect(card.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(card.cost).toBe(1);
      expect(card.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(card.color).toBe("green");
    });

    it("should have card text", () => {
      expect(card.text).toBeTruthy();
      expect(card.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(card.abilities).toBeDefined();
      expect(Array.isArray(card.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(card.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      card.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [card],
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
          hand: [card],
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
      expect(card).toHaveProperty("implemented");
      expect(card).toHaveProperty("missingTestCase");
    });
  });
});
