import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { assaultOnTorringtonBase } from "./114-assault-on-torrington-base";

/**
 * Tests for GD01-114: Assault on Torrington Base
 *
 * Card Properties:
 * - Cost: 1, Level: 1
 * - Color: red
 * - Type: triggered
 * - Rarity: common
 * Abilities:
 * - 【action】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-114: Assault on Torrington Base", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(assaultOnTorringtonBase.id).toBe("GD01-114");
      expect(assaultOnTorringtonBase.name).toBe("Assault on Torrington Base");
      expect(assaultOnTorringtonBase.number).toBe(114);
      expect(assaultOnTorringtonBase.set).toBe("GD01");
      expect(assaultOnTorringtonBase.type).toBe("command");
      expect(assaultOnTorringtonBase.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(assaultOnTorringtonBase.cost).toBe(1);
      expect(assaultOnTorringtonBase.level).toBe(1);
    });

    it("should have correct color", () => {
      expect(assaultOnTorringtonBase.color).toBe("red");
    });

    it("should have card text", () => {
      expect(assaultOnTorringtonBase.text).toBeTruthy();
      expect(assaultOnTorringtonBase.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(assaultOnTorringtonBase.abilities).toBeDefined();
      expect(Array.isArray(assaultOnTorringtonBase.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(assaultOnTorringtonBase.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      assaultOnTorringtonBase.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [assaultOnTorringtonBase],
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
          hand: [assaultOnTorringtonBase],
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
      expect(assaultOnTorringtonBase).toHaveProperty("implemented");
      expect(assaultOnTorringtonBase).toHaveProperty("missingTestCase");
    });
  });
});
