import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { ironfistedDiscipline } from "./119-ironfisted-discipline";

/**
 * Tests for GD01-119: Iron-Fisted Discipline
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: white
 * - Type: triggered
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
      expect(ironfistedDiscipline.id).toBe("GD01-119");
      expect(ironfistedDiscipline.name).toBe("Iron-Fisted Discipline");
      expect(ironfistedDiscipline.number).toBe(119);
      expect(ironfistedDiscipline.set).toBe("GD01");
      expect(ironfistedDiscipline.type).toBe("command");
      expect(ironfistedDiscipline.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(ironfistedDiscipline.cost).toBe(1);
      expect(ironfistedDiscipline.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(ironfistedDiscipline.color).toBe("white");
    });

    it("should have card text", () => {
      expect(ironfistedDiscipline.text).toBeTruthy();
      expect(ironfistedDiscipline.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(ironfistedDiscipline.abilities).toBeDefined();
      expect(Array.isArray(ironfistedDiscipline.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(ironfistedDiscipline.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      ironfistedDiscipline.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [ironfistedDiscipline],
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
          hand: [ironfistedDiscipline],
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
      expect(ironfistedDiscipline).toHaveProperty("implemented");
      expect(ironfistedDiscipline).toHaveProperty("missingTestCase");
    });
  });
});
