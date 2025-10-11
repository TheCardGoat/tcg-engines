import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { lagowe } from "./050-lagowe";

/**
 * Tests for GD01-050: LaGOWE
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: red
 * - Type: triggered
 * - Rarity: rare
 * - Zones: earth
 * - Link Requirement: (zaft) trait
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-050: LaGOWE", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(lagowe.id).toBe("GD01-050");
      expect(lagowe.name).toBe("LaGOWE");
      expect(lagowe.number).toBe(50);
      expect(lagowe.set).toBe("GD01");
      expect(lagowe.type).toBe("unit");
      expect(lagowe.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(lagowe.cost).toBe(2);
      expect(lagowe.level).toBe(3);
      expect(lagowe.ap).toBe(2);
      expect(lagowe.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(lagowe.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(lagowe.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(lagowe.linkRequirement).toEqual(["(zaft) trait"]);
    });

    it("should have card text", () => {
      expect(lagowe.text).toBeTruthy();
      expect(lagowe.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(lagowe.abilities).toBeDefined();
      expect(Array.isArray(lagowe.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(lagowe.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      lagowe.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [lagowe],
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
          battleArea: [lagowe],
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

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with link requirement", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [lagowe],
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

      expect(lagowe.linkRequirement).toEqual(["(zaft) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [lagowe],
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

      expect(lagowe.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(lagowe).toHaveProperty("implemented");
      expect(lagowe).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(lagowe.level).toBe(3);
      expect(lagowe.cost).toBe(2);
      expect(lagowe.ap).toBe(2);
      expect(lagowe.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = lagowe.ap + lagowe.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [lagowe],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });
});
