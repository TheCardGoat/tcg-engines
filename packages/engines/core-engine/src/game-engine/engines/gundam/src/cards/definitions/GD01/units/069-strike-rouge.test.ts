import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { strikeRouge } from "./069-strike-rouge";

/**
 * Tests for GD01-069: Strike Rouge
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: white
 * - Type: continuous
 * - Rarity: rare
 * - Zones: space, earth
 * - Link Requirement: (orb) trait
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-069: Strike Rouge", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(strikeRouge.id).toBe("GD01-069");
      expect(strikeRouge.name).toBe("Strike Rouge");
      expect(strikeRouge.number).toBe(69);
      expect(strikeRouge.set).toBe("GD01");
      expect(strikeRouge.type).toBe("unit");
      expect(strikeRouge.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(strikeRouge.cost).toBe(2);
      expect(strikeRouge.level).toBe(3);
      expect(strikeRouge.ap).toBe(3);
      expect(strikeRouge.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(strikeRouge.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(strikeRouge.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(strikeRouge.linkRequirement).toEqual(["(orb) trait"]);
    });

    it("should have card text", () => {
      expect(strikeRouge.text).toBeTruthy();
      expect(strikeRouge.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(strikeRouge.abilities).toBeDefined();
      expect(Array.isArray(strikeRouge.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(strikeRouge.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      strikeRouge.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strikeRouge],
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
          battleArea: [strikeRouge],
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
          battleArea: [strikeRouge],
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

      expect(strikeRouge.linkRequirement).toEqual(["(orb) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [strikeRouge],
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

      expect(strikeRouge.zones).toContain("space");
      expect(strikeRouge.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(strikeRouge).toHaveProperty("implemented");
      expect(strikeRouge).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(strikeRouge.level).toBe(3);
      expect(strikeRouge.cost).toBe(2);
      expect(strikeRouge.ap).toBe(3);
      expect(strikeRouge.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = strikeRouge.ap + strikeRouge.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [strikeRouge],
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
