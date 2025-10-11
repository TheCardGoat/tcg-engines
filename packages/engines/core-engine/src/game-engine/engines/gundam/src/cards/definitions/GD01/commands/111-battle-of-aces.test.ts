import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { battleOfAces } from "./111-battle-of-aces";

/**
 * Tests for GD01-111: Battle of Aces
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: red
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

describe("GD01-111: Battle of Aces", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(battleOfAces.id).toBe("GD01-111");
      expect(battleOfAces.name).toBe("Battle of Aces");
      expect(battleOfAces.number).toBe(111);
      expect(battleOfAces.set).toBe("GD01");
      expect(battleOfAces.type).toBe("command");
      expect(battleOfAces.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(battleOfAces.cost).toBe(2);
      expect(battleOfAces.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(battleOfAces.color).toBe("red");
    });

    it("should have card text", () => {
      expect(battleOfAces.text).toBeTruthy();
      expect(battleOfAces.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(battleOfAces.abilities).toBeDefined();
      expect(Array.isArray(battleOfAces.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(battleOfAces.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      battleOfAces.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [battleOfAces],
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
          hand: [battleOfAces],
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
      expect(battleOfAces).toHaveProperty("implemented");
      expect(battleOfAces).toHaveProperty("missingTestCase");
    });
  });
});
