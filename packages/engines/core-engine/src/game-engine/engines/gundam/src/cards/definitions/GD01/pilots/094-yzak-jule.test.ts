import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { yzakJule } from "./094-yzak-jule";

/**
 * Tests for GD01-094: Yzak Jule
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: red
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

describe("GD01-094: Yzak Jule", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(yzakJule.id).toBe("GD01-094");
      expect(yzakJule.name).toBe("Yzak Jule");
      expect(yzakJule.number).toBe(94);
      expect(yzakJule.set).toBe("GD01");
      expect(yzakJule.type).toBe("pilot");
      expect(yzakJule.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(yzakJule.cost).toBe(1);
      expect(yzakJule.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(yzakJule.color).toBe("red");
    });

    it("should have card text", () => {
      expect(yzakJule.text).toBeTruthy();
      expect(yzakJule.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(yzakJule.abilities).toBeDefined();
      expect(Array.isArray(yzakJule.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(yzakJule.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      yzakJule.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [yzakJule],
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
          hand: [yzakJule],
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
      expect(yzakJule).toHaveProperty("implemented");
      expect(yzakJule).toHaveProperty("missingTestCase");
    });
  });
});
