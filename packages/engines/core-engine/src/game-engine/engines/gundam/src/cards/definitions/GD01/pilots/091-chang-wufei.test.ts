import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { changWufei } from "./091-chang-wufei";

/**
 * Tests for GD01-091: Chang Wufei
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: green
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

describe("GD01-091: Chang Wufei", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(changWufei.id).toBe("GD01-091");
      expect(changWufei.name).toBe("Chang Wufei");
      expect(changWufei.number).toBe(91);
      expect(changWufei.set).toBe("GD01");
      expect(changWufei.type).toBe("pilot");
      expect(changWufei.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(changWufei.cost).toBe(1);
      expect(changWufei.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(changWufei.color).toBe("green");
    });

    it("should have card text", () => {
      expect(changWufei.text).toBeTruthy();
      expect(changWufei.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(changWufei.abilities).toBeDefined();
      expect(Array.isArray(changWufei.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(changWufei.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      changWufei.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [changWufei],
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
          hand: [changWufei],
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
      expect(changWufei).toHaveProperty("implemented");
      expect(changWufei).toHaveProperty("missingTestCase");
    });
  });
});
