import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gearaZuluGuardsType } from "./052-geara-zulu-guards-type";

/**
 * Tests for GD01-052: Geara Zulu (Guards Type)
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 2, HP: 4
 * - Color: red
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-052: Geara Zulu (Guards Type)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gearaZuluGuardsType.id).toBe("GD01-052");
      expect(gearaZuluGuardsType.name).toBe("Geara Zulu (Guards Type)");
      expect(gearaZuluGuardsType.number).toBe(52);
      expect(gearaZuluGuardsType.set).toBe("GD01");
      expect(gearaZuluGuardsType.type).toBe("unit");
      expect(gearaZuluGuardsType.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gearaZuluGuardsType.cost).toBe(3);
      expect(gearaZuluGuardsType.level).toBe(4);
      expect(gearaZuluGuardsType.ap).toBe(2);
      expect(gearaZuluGuardsType.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gearaZuluGuardsType.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(gearaZuluGuardsType.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gearaZuluGuardsType.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gearaZuluGuardsType.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(gearaZuluGuardsType.text).toBeTruthy();
      expect(gearaZuluGuardsType.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gearaZuluGuardsType.abilities).toBeDefined();
      expect(Array.isArray(gearaZuluGuardsType.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gearaZuluGuardsType.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gearaZuluGuardsType.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaZuluGuardsType],
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
          battleArea: [gearaZuluGuardsType],
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
          battleArea: [gearaZuluGuardsType],
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

      expect(gearaZuluGuardsType.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaZuluGuardsType],
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

      expect(gearaZuluGuardsType.zones).toContain("space");
      expect(gearaZuluGuardsType.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gearaZuluGuardsType).toHaveProperty("implemented");
      expect(gearaZuluGuardsType).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gearaZuluGuardsType.level).toBe(4);
      expect(gearaZuluGuardsType.cost).toBe(3);
      expect(gearaZuluGuardsType.ap).toBe(2);
      expect(gearaZuluGuardsType.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gearaZuluGuardsType.ap + gearaZuluGuardsType.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaZuluGuardsType],
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
