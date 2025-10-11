import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { card } from "./119-iron-fisted-discipline";

/**
 * Tests for GD01-119: Iron-Fisted Discipline
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: white
 * - Type: command
 * - Rarity: rare
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-119: Iron-Fisted Discipline", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(card.id).toBe("GD01-119");
      expect(card.name).toBe("Iron-Fisted Discipline");
      expect(card.number).toBe(119);
      expect(card.set).toBe("GD01");
      expect(card.type).toBe("command");
      expect(card.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(card.cost).toBe(1);
      expect(card.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(card.color).toBe("white");
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
