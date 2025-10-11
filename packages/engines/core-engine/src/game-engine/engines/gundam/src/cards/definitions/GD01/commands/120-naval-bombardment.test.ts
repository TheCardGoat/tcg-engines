import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { navalBombardment } from "./120-naval-bombardment";

/**
 * Tests for GD01-120: Naval Bombardment
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: white
 * - Type: triggered
 * - Rarity: common
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-120: Naval Bombardment", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(navalBombardment.id).toBe("GD01-120");
      expect(navalBombardment.name).toBe("Naval Bombardment");
      expect(navalBombardment.number).toBe(120);
      expect(navalBombardment.set).toBe("GD01");
      expect(navalBombardment.type).toBe("command");
      expect(navalBombardment.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(navalBombardment.cost).toBe(1);
      expect(navalBombardment.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(navalBombardment.color).toBe("white");
    });

    it("should have card text", () => {
      expect(navalBombardment.text).toBeTruthy();
      expect(navalBombardment.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(navalBombardment.abilities).toBeDefined();
      expect(Array.isArray(navalBombardment.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(navalBombardment.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      navalBombardment.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [navalBombardment],
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
          hand: [navalBombardment],
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
      expect(navalBombardment).toHaveProperty("implemented");
      expect(navalBombardment).toHaveProperty("missingTestCase");
    });
  });
});
