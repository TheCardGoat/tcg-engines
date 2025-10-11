import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { nahelArgama } from "./123-nahel-argama";

/**
 * Tests for GD01-123: Nahel Argama
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 0, HP: 5
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: earth federation, warship
 * - Zones: space, earth
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-123: Nahel Argama", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(nahelArgama.id).toBe("GD01-123");
      expect(nahelArgama.name).toBe("Nahel Argama");
      expect(nahelArgama.number).toBe(123);
      expect(nahelArgama.set).toBe("GD01");
      expect(nahelArgama.type).toBe("base");
      expect(nahelArgama.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(nahelArgama.cost).toBe(2);
      expect(nahelArgama.level).toBe(3);
      expect(nahelArgama.ap).toBe(0);
      expect(nahelArgama.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(nahelArgama.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(nahelArgama.traits).toEqual(["earth federation", "warship"]);
    });

    it("should have correct zones", () => {
      expect(nahelArgama.zones).toEqual(["space", "earth"]);
    });

    it("should have card text", () => {
      expect(nahelArgama.text).toBeTruthy();
      expect(nahelArgama.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(nahelArgama.abilities).toBeDefined();
      expect(Array.isArray(nahelArgama.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(nahelArgama.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      nahelArgama.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [nahelArgama],
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
          shieldBase: [nahelArgama],
          hand: 5,
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

      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(nahelArgama).toHaveProperty("implemented");
      expect(nahelArgama).toHaveProperty("missingTestCase");
    });
  });
});
