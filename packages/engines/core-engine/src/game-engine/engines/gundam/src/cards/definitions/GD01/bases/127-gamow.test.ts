import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gamow } from "./127-gamow";

/**
 * Tests for GD01-127: Gamow
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 0, HP: 5
 * - Color: red
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

describe("GD01-127: Gamow", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gamow.id).toBe("GD01-127");
      expect(gamow.name).toBe("Gamow");
      expect(gamow.number).toBe(127);
      expect(gamow.set).toBe("GD01");
      expect(gamow.type).toBe("base");
      expect(gamow.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gamow.cost).toBe(1);
      expect(gamow.level).toBe(2);
      expect(gamow.ap).toBe(0);
      expect(gamow.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(gamow.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(gamow.traits).toEqual(["warship"]);
    });

    it("should have correct zones", () => {
      expect(gamow.zones).toEqual(["space"]);
    });

    it("should have card text", () => {
      expect(gamow.text).toBeTruthy();
      expect(gamow.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gamow.abilities).toBeDefined();
      expect(Array.isArray(gamow.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gamow.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gamow.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gamow],
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
          shieldBase: [gamow],
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
      expect(gamow).toHaveProperty("implemented");
      expect(gamow).toHaveProperty("missingTestCase");
    });
  });
});
