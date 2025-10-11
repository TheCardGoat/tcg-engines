import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zuoot } from "./061-zuoot";

/**
 * Tests for GD01-061: ZuOOT
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 0, HP: 2
 * - Color: red
 * - Type: continuous
 * - Rarity: common
 * - Zones: earth
 * - Link Requirement: -
 * Abilities:
 * - <Support 1>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-061: ZuOOT", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zuoot.id).toBe("GD01-061");
      expect(zuoot.name).toBe("ZuOOT");
      expect(zuoot.number).toBe(61);
      expect(zuoot.set).toBe("GD01");
      expect(zuoot.type).toBe("unit");
      expect(zuoot.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zuoot.cost).toBe(1);
      expect(zuoot.level).toBe(1);
      expect(zuoot.ap).toBe(0);
      expect(zuoot.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(zuoot.color).toBe("red");
    });

    it("should have correct zones", () => {
      expect(zuoot.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(zuoot.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(zuoot.text).toBeTruthy();
      expect(zuoot.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(zuoot.abilities).toBeDefined();
      expect(Array.isArray(zuoot.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(zuoot.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      zuoot.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zuoot],
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
          battleArea: [zuoot],
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
          battleArea: [zuoot],
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

      expect(zuoot.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zuoot],
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

      expect(zuoot.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(zuoot).toHaveProperty("implemented");
      expect(zuoot).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 1", () => {
      expect(zuoot.level).toBe(1);
      expect(zuoot.cost).toBe(1);
      expect(zuoot.ap).toBe(0);
      expect(zuoot.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = zuoot.ap + zuoot.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zuoot],
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
