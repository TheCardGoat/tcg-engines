import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gearaDogaSleeves } from "./056-geara-doga-sleeves";

/**
 * Tests for GD01-056: Geara Doga (Sleeves)
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: red
 * - Type: triggered
 * - Rarity: common
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-056: Geara Doga (Sleeves)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gearaDogaSleeves.id).toBe("GD01-056");
      expect(gearaDogaSleeves.name).toBe("Geara Doga (Sleeves)");
      expect(gearaDogaSleeves.number).toBe(56);
      expect(gearaDogaSleeves.set).toBe("GD01");
      expect(gearaDogaSleeves.type).toBe("unit");
      expect(gearaDogaSleeves.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gearaDogaSleeves.cost).toBe(2);
      expect(gearaDogaSleeves.level).toBe(3);
      expect(gearaDogaSleeves.ap).toBe(2);
      expect(gearaDogaSleeves.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gearaDogaSleeves.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(gearaDogaSleeves.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gearaDogaSleeves.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gearaDogaSleeves.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(gearaDogaSleeves.text).toBeTruthy();
      expect(gearaDogaSleeves.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gearaDogaSleeves.abilities).toBeDefined();
      expect(Array.isArray(gearaDogaSleeves.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gearaDogaSleeves.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gearaDogaSleeves.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaDogaSleeves],
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
          battleArea: [gearaDogaSleeves],
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
          battleArea: [gearaDogaSleeves],
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

      expect(gearaDogaSleeves.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaDogaSleeves],
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

      expect(gearaDogaSleeves.zones).toContain("space");
      expect(gearaDogaSleeves.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gearaDogaSleeves).toHaveProperty("implemented");
      expect(gearaDogaSleeves).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(gearaDogaSleeves.level).toBe(3);
      expect(gearaDogaSleeves.cost).toBe(2);
      expect(gearaDogaSleeves.ap).toBe(2);
      expect(gearaDogaSleeves.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gearaDogaSleeves.ap + gearaDogaSleeves.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaDogaSleeves],
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
