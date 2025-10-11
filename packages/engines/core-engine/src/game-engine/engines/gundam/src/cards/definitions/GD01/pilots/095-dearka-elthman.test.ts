import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { dearkaElthman } from "./095-dearka-elthman";

/**
 * Tests for GD01-095: Dearka Elthman
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: red
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

describe("GD01-095: Dearka Elthman", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(dearkaElthman.id).toBe("GD01-095");
      expect(dearkaElthman.name).toBe("Dearka Elthman");
      expect(dearkaElthman.number).toBe(95);
      expect(dearkaElthman.set).toBe("GD01");
      expect(dearkaElthman.type).toBe("pilot");
      expect(dearkaElthman.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(dearkaElthman.cost).toBe(1);
      expect(dearkaElthman.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(dearkaElthman.color).toBe("red");
    });

    it("should have card text", () => {
      expect(dearkaElthman.text).toBeTruthy();
      expect(dearkaElthman.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(dearkaElthman.abilities).toBeDefined();
      expect(Array.isArray(dearkaElthman.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(dearkaElthman.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      dearkaElthman.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [dearkaElthman],
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
          hand: [dearkaElthman],
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
      expect(dearkaElthman).toHaveProperty("implemented");
      expect(dearkaElthman).toHaveProperty("missingTestCase");
    });
  });
});
