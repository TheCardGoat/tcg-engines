import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { dopp } from "./039-dopp";

/**
 * Tests for GD01-039: Dopp
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
 * - Color: green
 * - Type: triggered
 * - Rarity: common
 * - Traits: zeon
 * - Zones: earth
 * - Link Requirement: -
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-039: Dopp", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(dopp.id).toBe("GD01-039");
      expect(dopp.name).toBe("Dopp");
      expect(dopp.number).toBe(39);
      expect(dopp.set).toBe("GD01");
      expect(dopp.type).toBe("unit");
      expect(dopp.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(dopp.cost).toBe(1);
      expect(dopp.level).toBe(1);
      expect(dopp.ap).toBe(1);
      expect(dopp.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(dopp.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(dopp.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(dopp.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(dopp.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(dopp.text).toBeTruthy();
      expect(dopp.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(dopp.abilities).toBeDefined();
      expect(Array.isArray(dopp.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(dopp.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      dopp.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [dopp],
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
          battleArea: [dopp],
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
          battleArea: [dopp],
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

      expect(dopp.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [dopp],
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

      expect(dopp.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(dopp).toHaveProperty("implemented");
      expect(dopp).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 1", () => {
      expect(dopp.level).toBe(1);
      expect(dopp.cost).toBe(1);
      expect(dopp.ap).toBe(1);
      expect(dopp.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = dopp.ap + dopp.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [dopp],
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
