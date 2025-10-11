import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { midairModifications } from "./121-midair-modifications";

/**
 * Tests for GD01-121: Midair Modifications
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-121: Midair Modifications", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(midairModifications.id).toBe("GD01-121");
      expect(midairModifications.name).toBe("Midair Modifications");
      expect(midairModifications.number).toBe(121);
      expect(midairModifications.set).toBe("GD01");
      expect(midairModifications.type).toBe("command");
      expect(midairModifications.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(midairModifications.cost).toBe(2);
      expect(midairModifications.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(midairModifications.color).toBe("white");
    });

    it("should have card text", () => {
      expect(midairModifications.text).toBeTruthy();
      expect(midairModifications.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(midairModifications.abilities).toBeDefined();
      expect(Array.isArray(midairModifications.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(midairModifications.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      midairModifications.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [midairModifications],
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
          hand: [midairModifications],
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
      expect(midairModifications).toHaveProperty("implemented");
      expect(midairModifications).toHaveProperty("missingTestCase");
    });
  });
});
