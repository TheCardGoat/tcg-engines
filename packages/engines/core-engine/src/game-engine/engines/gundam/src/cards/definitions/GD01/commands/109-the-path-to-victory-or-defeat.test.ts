import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { thePathToVictoryOrDefeat } from "./109-the-path-to-victory-or-defeat";

/**
 * Tests for GD01-109: The Path to Victory or Defeat
 *
 * Card Properties:
 * - Cost: 1, Level: 5
 * - Color: green
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

describe("GD01-109: The Path to Victory or Defeat", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(thePathToVictoryOrDefeat.id).toBe("GD01-109");
      expect(thePathToVictoryOrDefeat.name).toBe(
        "The Path to Victory or Defeat",
      );
      expect(thePathToVictoryOrDefeat.number).toBe(109);
      expect(thePathToVictoryOrDefeat.set).toBe("GD01");
      expect(thePathToVictoryOrDefeat.type).toBe("command");
      expect(thePathToVictoryOrDefeat.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(thePathToVictoryOrDefeat.cost).toBe(1);
      expect(thePathToVictoryOrDefeat.level).toBe(5);
    });

    it("should have correct color", () => {
      expect(thePathToVictoryOrDefeat.color).toBe("green");
    });

    it("should have card text", () => {
      expect(thePathToVictoryOrDefeat.text).toBeTruthy();
      expect(thePathToVictoryOrDefeat.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(thePathToVictoryOrDefeat.abilities).toBeDefined();
      expect(Array.isArray(thePathToVictoryOrDefeat.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(thePathToVictoryOrDefeat.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      thePathToVictoryOrDefeat.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [thePathToVictoryOrDefeat],
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
          hand: [thePathToVictoryOrDefeat],
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
      expect(thePathToVictoryOrDefeat).toHaveProperty("implemented");
      expect(thePathToVictoryOrDefeat).toHaveProperty("missingTestCase");
    });
  });
});
