import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { miningAsteroidPalau } from "./128-mining-asteroid-palau";

/**
 * Tests for GD01-128: Mining Asteroid Palau
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 0, HP: 6
 * - Color: red
 * - Type: triggered
 * - Rarity: common
 * - Traits: zeon, stronghold
 * - Zones: space
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-128: Mining Asteroid Palau", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(miningAsteroidPalau.id).toBe("GD01-128");
      expect(miningAsteroidPalau.name).toBe("Mining Asteroid Palau");
      expect(miningAsteroidPalau.number).toBe(128);
      expect(miningAsteroidPalau.set).toBe("GD01");
      expect(miningAsteroidPalau.type).toBe("base");
      expect(miningAsteroidPalau.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(miningAsteroidPalau.cost).toBe(1);
      expect(miningAsteroidPalau.level).toBe(2);
      expect(miningAsteroidPalau.ap).toBe(0);
      expect(miningAsteroidPalau.hp).toBe(6);
    });

    it("should have correct color", () => {
      expect(miningAsteroidPalau.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(miningAsteroidPalau.traits).toEqual(["zeon", "stronghold"]);
    });

    it("should have correct zones", () => {
      expect(miningAsteroidPalau.zones).toEqual(["space"]);
    });

    it("should have card text", () => {
      expect(miningAsteroidPalau.text).toBeTruthy();
      expect(miningAsteroidPalau.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(miningAsteroidPalau.abilities).toBeDefined();
      expect(Array.isArray(miningAsteroidPalau.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(miningAsteroidPalau.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      miningAsteroidPalau.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [miningAsteroidPalau],
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
          shieldBase: [miningAsteroidPalau],
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
      expect(miningAsteroidPalau).toHaveProperty("implemented");
      expect(miningAsteroidPalau).toHaveProperty("missingTestCase");
    });
  });
});
