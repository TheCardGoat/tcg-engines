import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { securingTheSupplyLine } from "./102-securing-the-supply-line";

/**
 * Tests for GD01-102: Securing the Supply Line
 *
 * Card Properties:
 * - Cost: 2, Level: 4
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * Abilities:
 * - 【Main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-102: Securing the Supply Line", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(securingTheSupplyLine.id).toBe("GD01-102");
      expect(securingTheSupplyLine.name).toBe("Securing the Supply Line");
      expect(securingTheSupplyLine.number).toBe(102);
      expect(securingTheSupplyLine.set).toBe("GD01");
      expect(securingTheSupplyLine.type).toBe("command");
      expect(securingTheSupplyLine.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(securingTheSupplyLine.cost).toBe(2);
      expect(securingTheSupplyLine.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(securingTheSupplyLine.color).toBe("blue");
    });

    it("should have card text", () => {
      expect(securingTheSupplyLine.text).toBeTruthy();
      expect(securingTheSupplyLine.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(securingTheSupplyLine.abilities).toBeDefined();
      expect(Array.isArray(securingTheSupplyLine.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(securingTheSupplyLine.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      securingTheSupplyLine.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [securingTheSupplyLine],
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
          hand: [securingTheSupplyLine],
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
      expect(securingTheSupplyLine).toHaveProperty("implemented");
      expect(securingTheSupplyLine).toHaveProperty("missingTestCase");
    });
  });
});
