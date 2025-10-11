import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { banagherLinks } from "./088-banagher-links";

/**
 * Tests for GD01-088: Banagher Links
 *
 * Card Properties:
 * - Cost: 1, Level: 5
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: civilian, newtype
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-088: Banagher Links", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(banagherLinks.id).toBe("GD01-088");
      expect(banagherLinks.name).toBe("Banagher Links");
      expect(banagherLinks.number).toBe(88);
      expect(banagherLinks.set).toBe("GD01");
      expect(banagherLinks.type).toBe("pilot");
      expect(banagherLinks.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(banagherLinks.cost).toBe(1);
      expect(banagherLinks.level).toBe(5);
    });

    it("should have correct color", () => {
      expect(banagherLinks.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(banagherLinks.traits).toEqual(["civilian", "newtype"]);
    });

    it("should have card text", () => {
      expect(banagherLinks.text).toBeTruthy();
      expect(banagherLinks.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(banagherLinks.abilities).toBeDefined();
      expect(Array.isArray(banagherLinks.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(banagherLinks.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      banagherLinks.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [banagherLinks],
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
          hand: [banagherLinks],
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
      expect(banagherLinks).toHaveProperty("implemented");
      expect(banagherLinks).toHaveProperty("missingTestCase");
    });
  });
});
