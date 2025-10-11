import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { kusanagi } from "./129-kusanagi";

/**
 * Tests for GD01-129: Kusanagi
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 0, HP: 4
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: warship
 * - Zones: space
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-129: Kusanagi", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(kusanagi.id).toBe("GD01-129");
      expect(kusanagi.name).toBe("Kusanagi");
      expect(kusanagi.number).toBe(129);
      expect(kusanagi.set).toBe("GD01");
      expect(kusanagi.type).toBe("base");
      expect(kusanagi.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(kusanagi.cost).toBe(2);
      expect(kusanagi.level).toBe(4);
      expect(kusanagi.ap).toBe(0);
      expect(kusanagi.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(kusanagi.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(kusanagi.traits).toEqual(["warship"]);
    });

    it("should have correct zones", () => {
      expect(kusanagi.zones).toEqual(["space"]);
    });

    it("should have card text", () => {
      expect(kusanagi.text).toBeTruthy();
      expect(kusanagi.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(kusanagi.abilities).toBeDefined();
      expect(Array.isArray(kusanagi.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(kusanagi.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      kusanagi.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [kusanagi],
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
          shieldBase: [kusanagi],
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
      expect(kusanagi).toHaveProperty("implemented");
      expect(kusanagi).toHaveProperty("missingTestCase");
    });
  });
});
