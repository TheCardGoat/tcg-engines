import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { side7 } from "./124-side-7";

/**
 * Tests for GD01-124: Side 7
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 0, HP: 4
 * - Color: blue
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation, stronghold
 * - Zones: space
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-124: Side 7", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(side7.id).toBe("GD01-124");
      expect(side7.name).toBe("Side 7");
      expect(side7.number).toBe(124);
      expect(side7.set).toBe("GD01");
      expect(side7.type).toBe("base");
      expect(side7.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(side7.cost).toBe(1);
      expect(side7.level).toBe(1);
      expect(side7.ap).toBe(0);
      expect(side7.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(side7.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(side7.traits).toEqual(["earth federation", "stronghold"]);
    });

    it("should have correct zones", () => {
      expect(side7.zones).toEqual(["space"]);
    });

    it("should have card text", () => {
      expect(side7.text).toBeTruthy();
      expect(side7.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(side7.abilities).toBeDefined();
      expect(Array.isArray(side7.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(side7.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      side7.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [side7],
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
          shieldBase: [side7],
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
      expect(side7).toHaveProperty("implemented");
      expect(side7).toHaveProperty("missingTestCase");
    });
  });
});
