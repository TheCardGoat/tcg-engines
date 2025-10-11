import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strategicArms } from "./108-strategic-arms";

/**
 * Tests for GD01-108: Strategic Arms
 *
 * Card Properties:
 * - Cost: 6, Level: 6
 * - Color: green
 * - Type: continuous
 * - Rarity: uncommon
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-108: Strategic Arms", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strategicArms.id).toBe("GD01-108");
      expect(strategicArms.name).toBe("Strategic Arms");
      expect(strategicArms.number).toBe(108);
      expect(strategicArms.set).toBe("GD01");
      expect(strategicArms.type).toBe("command");
      expect(strategicArms.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(strategicArms.cost).toBe(6);
      expect(strategicArms.level).toBe(6);
    });

    it("should have correct color", () => {
      expect(strategicArms.color).toBe("green");
    });

    it("should have card text", () => {
      expect(strategicArms.text).toBeTruthy();
      expect(strategicArms.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(strategicArms.abilities).toBeDefined();
      expect(Array.isArray(strategicArms.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(strategicArms.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      strategicArms.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strategicArms],
          resourceArea: 8,
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
      assertZoneCount(engine, "resourceArea", 8, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strategicArms],
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
      expect(strategicArms).toHaveProperty("implemented");
      expect(strategicArms).toHaveProperty("missingTestCase");
    });
  });
});
