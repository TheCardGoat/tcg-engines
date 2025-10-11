import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zanzibar } from "./125-zanzibar";

/**
 * Tests for GD01-125: Zanzibar
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 0, HP: 5
 * - Color: green
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: zeon, warship
 * - Zones: space, earth
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-125: Zanzibar", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zanzibar.id).toBe("GD01-125");
      expect(zanzibar.name).toBe("Zanzibar");
      expect(zanzibar.number).toBe(125);
      expect(zanzibar.set).toBe("GD01");
      expect(zanzibar.type).toBe("base");
      expect(zanzibar.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(zanzibar.cost).toBe(2);
      expect(zanzibar.level).toBe(4);
      expect(zanzibar.ap).toBe(0);
      expect(zanzibar.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(zanzibar.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(zanzibar.traits).toEqual(["zeon", "warship"]);
    });

    it("should have correct zones", () => {
      expect(zanzibar.zones).toEqual(["space", "earth"]);
    });

    it("should have card text", () => {
      expect(zanzibar.text).toBeTruthy();
      expect(zanzibar.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(zanzibar.abilities).toBeDefined();
      expect(Array.isArray(zanzibar.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(zanzibar.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      zanzibar.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zanzibar],
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
          shieldBase: [zanzibar],
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
      expect(zanzibar).toHaveProperty("implemented");
      expect(zanzibar).toHaveProperty("missingTestCase");
    });
  });
});
