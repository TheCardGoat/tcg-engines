import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { undergroundDesertBase } from "./126-underground-desert-base";

/**
 * Tests for GD01-126: Underground Desert Base
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 0, HP: 6
 * - Color: green
 * - Type: triggered
 * - Rarity: common
 * - Traits: stronghold
 * - Zones: earth
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-126: Underground Desert Base", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(undergroundDesertBase.id).toBe("GD01-126");
      expect(undergroundDesertBase.name).toBe("Underground Desert Base");
      expect(undergroundDesertBase.number).toBe(126);
      expect(undergroundDesertBase.set).toBe("GD01");
      expect(undergroundDesertBase.type).toBe("base");
      expect(undergroundDesertBase.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(undergroundDesertBase.cost).toBe(1);
      expect(undergroundDesertBase.level).toBe(2);
      expect(undergroundDesertBase.ap).toBe(0);
      expect(undergroundDesertBase.hp).toBe(6);
    });

    it("should have correct color", () => {
      expect(undergroundDesertBase.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(undergroundDesertBase.traits).toEqual(["stronghold"]);
    });

    it("should have correct zones", () => {
      expect(undergroundDesertBase.zones).toEqual(["earth"]);
    });

    it("should have card text", () => {
      expect(undergroundDesertBase.text).toBeTruthy();
      expect(undergroundDesertBase.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(undergroundDesertBase.abilities).toBeDefined();
      expect(Array.isArray(undergroundDesertBase.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(undergroundDesertBase.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      undergroundDesertBase.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [undergroundDesertBase],
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
          shieldBase: [undergroundDesertBase],
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
      expect(undergroundDesertBase).toHaveProperty("implemented");
      expect(undergroundDesertBase).toHaveProperty("missingTestCase");
    });
  });
});
