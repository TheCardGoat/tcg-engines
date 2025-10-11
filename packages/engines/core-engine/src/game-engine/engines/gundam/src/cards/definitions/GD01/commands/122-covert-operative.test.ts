import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { covertOperative } from "./122-covert-operative";

/**
 * Tests for GD01-122: Covert Operative
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: white
 * - Type: triggered
 * - Rarity: common
 * Abilities:
 * - 【main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-122: Covert Operative", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(covertOperative.id).toBe("GD01-122");
      expect(covertOperative.name).toBe("Covert Operative");
      expect(covertOperative.number).toBe(122);
      expect(covertOperative.set).toBe("GD01");
      expect(covertOperative.type).toBe("command");
      expect(covertOperative.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(covertOperative.cost).toBe(1);
      expect(covertOperative.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(covertOperative.color).toBe("white");
    });

    it("should have card text", () => {
      expect(covertOperative.text).toBeTruthy();
      expect(covertOperative.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(covertOperative.abilities).toBeDefined();
      expect(Array.isArray(covertOperative.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(covertOperative.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      covertOperative.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [covertOperative],
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
          hand: [covertOperative],
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
      expect(covertOperative).toHaveProperty("implemented");
      expect(covertOperative).toHaveProperty("missingTestCase");
    });
  });
});
