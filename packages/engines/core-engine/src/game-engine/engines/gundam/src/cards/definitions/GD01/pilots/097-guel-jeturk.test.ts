import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guelJeturk } from "./097-guel-jeturk";

/**
 * Tests for GD01-097: Guel Jeturk
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: academy
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-097: Guel Jeturk", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guelJeturk.id).toBe("GD01-097");
      expect(guelJeturk.name).toBe("Guel Jeturk");
      expect(guelJeturk.number).toBe(97);
      expect(guelJeturk.set).toBe("GD01");
      expect(guelJeturk.type).toBe("pilot");
      expect(guelJeturk.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(guelJeturk.cost).toBe(1);
      expect(guelJeturk.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(guelJeturk.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(guelJeturk.traits).toEqual(["academy"]);
    });

    it("should have card text", () => {
      expect(guelJeturk.text).toBeTruthy();
      expect(guelJeturk.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(guelJeturk.abilities).toBeDefined();
      expect(Array.isArray(guelJeturk.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(guelJeturk.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      guelJeturk.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guelJeturk],
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
          hand: [guelJeturk],
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
      expect(guelJeturk).toHaveProperty("implemented");
      expect(guelJeturk).toHaveProperty("missingTestCase");
    });
  });
});
