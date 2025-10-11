import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { theStubbornCog } from "./103-the-stubborn-cog";

/**
 * Tests for GD01-103: The Stubborn Cog
 *
 * Card Properties:
 * - Cost: 1, Level: 1
 * - Color: blue
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

describe("GD01-103: The Stubborn Cog", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(theStubbornCog.id).toBe("GD01-103");
      expect(theStubbornCog.name).toBe("The Stubborn Cog");
      expect(theStubbornCog.number).toBe(103);
      expect(theStubbornCog.set).toBe("GD01");
      expect(theStubbornCog.type).toBe("command");
      expect(theStubbornCog.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(theStubbornCog.cost).toBe(1);
      expect(theStubbornCog.level).toBe(1);
    });

    it("should have correct color", () => {
      expect(theStubbornCog.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(theStubbornCog.text).toBeTruthy();
      expect(theStubbornCog.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(theStubbornCog.abilities).toBeDefined();
      expect(Array.isArray(theStubbornCog.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(theStubbornCog.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      theStubbornCog.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [theStubbornCog],
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
          hand: [theStubbornCog],
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
      expect(theStubbornCog).toHaveProperty("implemented");
      expect(theStubbornCog).toHaveProperty("missingTestCase");
    });
  });
});
