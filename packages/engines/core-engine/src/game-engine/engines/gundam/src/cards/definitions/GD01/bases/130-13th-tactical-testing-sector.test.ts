import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { thirteenthTacticalTestingSector } from "./130-13th-tactical-testing-sector";

/**
 * Tests for GD01-130: 13th Tactical Testing Sector
 *
 * Card Properties:
 * - Cost: 1, Level: 3, AP: 0, HP: 5
 * - Color: white
 * - Type: triggered
 * - Rarity: common
 * - Traits: academy, stronghold
 * - Zones: space
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-130: 13th Tactical Testing Sector", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(thirteenthTacticalTestingSector.id).toBe("GD01-130");
      expect(thirteenthTacticalTestingSector.name).toBe(
        "13th Tactical Testing Sector",
      );
      expect(thirteenthTacticalTestingSector.number).toBe(130);
      expect(thirteenthTacticalTestingSector.set).toBe("GD01");
      expect(thirteenthTacticalTestingSector.type).toBe("base");
      expect(thirteenthTacticalTestingSector.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(thirteenthTacticalTestingSector.cost).toBe(1);
      expect(thirteenthTacticalTestingSector.level).toBe(3);
      expect(thirteenthTacticalTestingSector.ap).toBe(0);
      expect(thirteenthTacticalTestingSector.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(thirteenthTacticalTestingSector.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(thirteenthTacticalTestingSector.traits).toEqual([
        "academy",
        "stronghold",
      ]);
    });

    it("should have correct zones", () => {
      expect(thirteenthTacticalTestingSector.zones).toEqual(["space"]);
    });

    it("should have card text", () => {
      expect(thirteenthTacticalTestingSector.text).toBeTruthy();
      expect(thirteenthTacticalTestingSector.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(thirteenthTacticalTestingSector.abilities).toBeDefined();
      expect(Array.isArray(thirteenthTacticalTestingSector.abilities)).toBe(
        true,
      );
    });

    it("should have at least one ability", () => {
      expect(thirteenthTacticalTestingSector.abilities.length).toBeGreaterThan(
        0,
      );
    });

    it("should have properly structured abilities", () => {
      thirteenthTacticalTestingSector.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [thirteenthTacticalTestingSector],
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
          shieldBase: [thirteenthTacticalTestingSector],
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
      expect(thirteenthTacticalTestingSector).toHaveProperty("implemented");
      expect(thirteenthTacticalTestingSector).toHaveProperty("missingTestCase");
    });
  });
});
