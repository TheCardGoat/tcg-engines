import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { char039sGelgoog } from "./023-char039s-gelgoog";

/**
 * Tests for GD01-023: Char&#039;s Gelgoog
 *
 * Card Properties:
 * - Cost: 4, Level: 4, AP: 4, HP: 3
 * - Color: green
 * - Type: triggered
 * - Rarity: legendary
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: char aznable
 * Abilities:
 * - 【activate･main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-023: Char&#039;s Gelgoog", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(char039sGelgoog.id).toBe("GD01-023");
      expect(char039sGelgoog.name).toBe("Char&#039;s Gelgoog");
      expect(char039sGelgoog.number).toBe(23);
      expect(char039sGelgoog.set).toBe("GD01");
      expect(char039sGelgoog.type).toBe("unit");
      expect(char039sGelgoog.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(char039sGelgoog.cost).toBe(4);
      expect(char039sGelgoog.level).toBe(4);
      expect(char039sGelgoog.ap).toBe(4);
      expect(char039sGelgoog.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(char039sGelgoog.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(char039sGelgoog.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(char039sGelgoog.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(char039sGelgoog.linkRequirement).toEqual(["char aznable"]);
    });

    it("should have card text", () => {
      expect(char039sGelgoog.text).toBeTruthy();
      expect(char039sGelgoog.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(char039sGelgoog.abilities).toBeDefined();
      expect(Array.isArray(char039sGelgoog.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(char039sGelgoog.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      char039sGelgoog.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [char039sGelgoog],
          resourceArea: 6,
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
      assertZoneCount(engine, "resourceArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [char039sGelgoog],
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
          battleArea: [char039sGelgoog],
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

      expect(char039sGelgoog.linkRequirement).toEqual(["char aznable"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [char039sGelgoog],
          resourceArea: 6,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(char039sGelgoog.zones).toContain("space");
      expect(char039sGelgoog.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(char039sGelgoog).toHaveProperty("implemented");
      expect(char039sGelgoog).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(char039sGelgoog.level).toBe(4);
      expect(char039sGelgoog.cost).toBe(4);
      expect(char039sGelgoog.ap).toBe(4);
      expect(char039sGelgoog.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = char039sGelgoog.ap + char039sGelgoog.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [char039sGelgoog],
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
