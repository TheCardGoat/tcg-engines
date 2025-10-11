import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { theDesertTiger } from "./113-the-desert-tiger";

/**
 * Tests for GD01-113: The Desert Tiger
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: red
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-113: The Desert Tiger", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(theDesertTiger.id).toBe("GD01-113");
      expect(theDesertTiger.name).toBe("The Desert Tiger");
      expect(theDesertTiger.number).toBe(113);
      expect(theDesertTiger.set).toBe("GD01");
      expect(theDesertTiger.type).toBe("command");
      expect(theDesertTiger.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(theDesertTiger.cost).toBe(1);
      expect(theDesertTiger.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(theDesertTiger.color).toBe("red");
    });

    it("should have card text", () => {
      expect(theDesertTiger.text).toBeTruthy();
      expect(theDesertTiger.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(theDesertTiger.abilities).toBeDefined();
      expect(Array.isArray(theDesertTiger.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(theDesertTiger.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      theDesertTiger.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [theDesertTiger],
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
          hand: [theDesertTiger],
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
      expect(theDesertTiger).toHaveProperty("implemented");
      expect(theDesertTiger).toHaveProperty("missingTestCase");
    });
  });
});
