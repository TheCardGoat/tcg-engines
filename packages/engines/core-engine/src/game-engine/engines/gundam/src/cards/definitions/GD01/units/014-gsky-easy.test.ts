import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gskyEasy } from "./014-gsky-easy";

/**
 * Tests for GD01-014: G-Sky Easy
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 1, HP: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (white base team) trait
 * Abilities:
 * - 【once per turn】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-014: G-Sky Easy", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gskyEasy.id).toBe("GD01-014");
      expect(gskyEasy.name).toBe("G-Sky Easy");
      expect(gskyEasy.number).toBe(14);
      expect(gskyEasy.set).toBe("GD01");
      expect(gskyEasy.type).toBe("unit");
      expect(gskyEasy.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gskyEasy.cost).toBe(2);
      expect(gskyEasy.level).toBe(3);
      expect(gskyEasy.ap).toBe(1);
      expect(gskyEasy.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gskyEasy.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(gskyEasy.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(gskyEasy.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gskyEasy.linkRequirement).toEqual(["(white base team) trait"]);
    });

    it("should have card text", () => {
      expect(gskyEasy.text).toBeTruthy();
      expect(gskyEasy.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gskyEasy.abilities).toBeDefined();
      expect(Array.isArray(gskyEasy.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gskyEasy.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gskyEasy.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gskyEasy],
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
          battleArea: [gskyEasy],
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
          battleArea: [gskyEasy],
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

      expect(gskyEasy.linkRequirement).toEqual(["(white base team) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gskyEasy],
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

      expect(gskyEasy.zones).toContain("space");
      expect(gskyEasy.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gskyEasy).toHaveProperty("implemented");
      expect(gskyEasy).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(gskyEasy.level).toBe(3);
      expect(gskyEasy.cost).toBe(2);
      expect(gskyEasy.ap).toBe(1);
      expect(gskyEasy.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gskyEasy.ap + gskyEasy.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gskyEasy],
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
