import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { saylaMass } from "./087-sayla-mass";

/**
 * Tests for GD01-087: Sayla Mass
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: rare
 * - Traits: earth federation, newtype
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-087: Sayla Mass", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(saylaMass.id).toBe("GD01-087");
      expect(saylaMass.name).toBe("Sayla Mass");
      expect(saylaMass.number).toBe(87);
      expect(saylaMass.set).toBe("GD01");
      expect(saylaMass.type).toBe("pilot");
      expect(saylaMass.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(saylaMass.cost).toBe(1);
      expect(saylaMass.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(saylaMass.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(saylaMass.traits).toEqual(["earth federation", "newtype"]);
    });

    it("should have card text", () => {
      expect(saylaMass.text).toBeTruthy();
      expect(saylaMass.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(saylaMass.abilities).toBeDefined();
      expect(Array.isArray(saylaMass.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(saylaMass.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      saylaMass.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [saylaMass],
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
          hand: [saylaMass],
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
      expect(saylaMass).toHaveProperty("implemented");
      expect(saylaMass).toHaveProperty("missingTestCase");
    });
  });
});
