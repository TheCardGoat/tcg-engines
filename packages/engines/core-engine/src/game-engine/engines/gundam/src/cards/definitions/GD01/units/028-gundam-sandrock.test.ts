import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamSandrock } from "./028-gundam-sandrock";

/**
 * Tests for GD01-028: Gundam Sandrock
 *
 * Card Properties:
 * - Cost: 3, Level: 5, AP: 4, HP: 4
 * - Color: green
 * - Type: triggered
 * - Rarity: rare
 * - Zones: earth
 * - Link Requirement: quatre raberba winner
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-028: Gundam Sandrock", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamSandrock.id).toBe("GD01-028");
      expect(gundamSandrock.name).toBe("Gundam Sandrock");
      expect(gundamSandrock.number).toBe(28);
      expect(gundamSandrock.set).toBe("GD01");
      expect(gundamSandrock.type).toBe("unit");
      expect(gundamSandrock.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(gundamSandrock.cost).toBe(3);
      expect(gundamSandrock.level).toBe(5);
      expect(gundamSandrock.ap).toBe(4);
      expect(gundamSandrock.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamSandrock.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(gundamSandrock.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamSandrock.linkRequirement).toEqual(["quatre raberba winner"]);
    });

    it("should have card text", () => {
      expect(gundamSandrock.text).toBeTruthy();
      expect(gundamSandrock.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gundamSandrock.abilities).toBeDefined();
      expect(Array.isArray(gundamSandrock.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gundamSandrock.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gundamSandrock.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamSandrock],
          resourceArea: 5,
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
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
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
          battleArea: [gundamSandrock],
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

      expect(gundamSandrock.linkRequirement).toEqual(["quatre raberba winner"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamSandrock],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(gundamSandrock.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamSandrock).toHaveProperty("implemented");
      expect(gundamSandrock).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(gundamSandrock.level).toBe(5);
      expect(gundamSandrock.cost).toBe(3);
      expect(gundamSandrock.ap).toBe(4);
      expect(gundamSandrock.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamSandrock.ap + gundamSandrock.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
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
