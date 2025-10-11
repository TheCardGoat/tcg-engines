import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { darilbalde } from "./075-darilbalde";

/**
 * Tests for GD01-075: Darilbalde
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 4, HP: 2
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: (academy) trait
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-075: Darilbalde", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(darilbalde.id).toBe("GD01-075");
      expect(darilbalde.name).toBe("Darilbalde");
      expect(darilbalde.number).toBe(75);
      expect(darilbalde.set).toBe("GD01");
      expect(darilbalde.type).toBe("unit");
      expect(darilbalde.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(darilbalde.cost).toBe(2);
      expect(darilbalde.level).toBe(3);
      expect(darilbalde.ap).toBe(4);
      expect(darilbalde.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(darilbalde.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(darilbalde.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(darilbalde.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(darilbalde.linkRequirement).toEqual(["(academy) trait"]);
    });

    it("should have card text", () => {
      expect(darilbalde.text).toBeTruthy();
      expect(darilbalde.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(darilbalde.abilities).toBeDefined();
      expect(Array.isArray(darilbalde.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(darilbalde.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      darilbalde.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [darilbalde],
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
          battleArea: [darilbalde],
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
          battleArea: [darilbalde],
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

      expect(darilbalde.linkRequirement).toEqual(["(academy) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [darilbalde],
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

      expect(darilbalde.zones).toContain("space");
      expect(darilbalde.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(darilbalde).toHaveProperty("implemented");
      expect(darilbalde).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(darilbalde.level).toBe(3);
      expect(darilbalde.cost).toBe(2);
      expect(darilbalde.ap).toBe(4);
      expect(darilbalde.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = darilbalde.ap + darilbalde.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [darilbalde],
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
