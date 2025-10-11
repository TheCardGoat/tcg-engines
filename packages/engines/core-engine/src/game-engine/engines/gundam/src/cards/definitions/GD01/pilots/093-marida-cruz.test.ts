import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { maridaCruz } from "./093-marida-cruz";

/**
 * Tests for GD01-093: Marida Cruz
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: red
 * - Type: triggered
 * - Rarity: rare
 * - Traits: zeon, newtype
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-093: Marida Cruz", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(maridaCruz.id).toBe("GD01-093");
      expect(maridaCruz.name).toBe("Marida Cruz");
      expect(maridaCruz.number).toBe(93);
      expect(maridaCruz.set).toBe("GD01");
      expect(maridaCruz.type).toBe("pilot");
      expect(maridaCruz.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(maridaCruz.cost).toBe(1);
      expect(maridaCruz.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(maridaCruz.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(maridaCruz.traits).toEqual(["zeon", "newtype"]);
    });

    it("should have card text", () => {
      expect(maridaCruz.text).toBeTruthy();
      expect(maridaCruz.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(maridaCruz.abilities).toBeDefined();
      expect(Array.isArray(maridaCruz.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(maridaCruz.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      maridaCruz.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [maridaCruz],
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
          hand: [maridaCruz],
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
      expect(maridaCruz).toHaveProperty("implemented");
      expect(maridaCruz).toHaveProperty("missingTestCase");
    });
  });
});
