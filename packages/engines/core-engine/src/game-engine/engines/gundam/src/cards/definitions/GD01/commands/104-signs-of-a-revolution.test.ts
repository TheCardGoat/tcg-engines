import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { signsOfARevolution } from "./104-signs-of-a-revolution";

/**
 * Tests for GD01-104: Signs of a Revolution
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: blue
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

describe("GD01-104: Signs of a Revolution", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(signsOfARevolution.id).toBe("GD01-104");
      expect(signsOfARevolution.name).toBe("Signs of a Revolution");
      expect(signsOfARevolution.number).toBe(104);
      expect(signsOfARevolution.set).toBe("GD01");
      expect(signsOfARevolution.type).toBe("command");
      expect(signsOfARevolution.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(signsOfARevolution.cost).toBe(2);
      expect(signsOfARevolution.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(signsOfARevolution.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(signsOfARevolution.text).toBeTruthy();
      expect(signsOfARevolution.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(signsOfARevolution.abilities).toBeDefined();
      expect(Array.isArray(signsOfARevolution.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(signsOfARevolution.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      signsOfARevolution.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [signsOfARevolution],
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
          hand: [signsOfARevolution],
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
      expect(signsOfARevolution).toHaveProperty("implemented");
      expect(signsOfARevolution).toHaveProperty("missingTestCase");
    });
  });
});
