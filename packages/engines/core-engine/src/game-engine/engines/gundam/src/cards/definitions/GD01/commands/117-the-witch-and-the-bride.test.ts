import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { theWitchAndTheBride } from "./117-the-witch-and-the-bride";

/**
 * Tests for GD01-117: The Witch and the Bride
 *
 * Card Properties:
 * - Cost: 2, Level: 5
 * - Color: white
 * - Type: triggered
 * - Rarity: rare
 * Abilities:
 * - 【burst】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-117: The Witch and the Bride", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(theWitchAndTheBride.id).toBe("GD01-117");
      expect(theWitchAndTheBride.name).toBe("The Witch and the Bride");
      expect(theWitchAndTheBride.number).toBe(117);
      expect(theWitchAndTheBride.set).toBe("GD01");
      expect(theWitchAndTheBride.type).toBe("command");
      expect(theWitchAndTheBride.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(theWitchAndTheBride.cost).toBe(2);
      expect(theWitchAndTheBride.level).toBe(5);
    });

    it("should have correct color", () => {
      expect(theWitchAndTheBride.color).toBe("white");
    });

    it("should have card text", () => {
      expect(theWitchAndTheBride.text).toBeTruthy();
      expect(theWitchAndTheBride.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(theWitchAndTheBride.abilities).toBeDefined();
      expect(Array.isArray(theWitchAndTheBride.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(theWitchAndTheBride.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      theWitchAndTheBride.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [theWitchAndTheBride],
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
          hand: [theWitchAndTheBride],
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
      expect(theWitchAndTheBride).toHaveProperty("implemented");
      expect(theWitchAndTheBride).toHaveProperty("missingTestCase");
    });
  });
});
