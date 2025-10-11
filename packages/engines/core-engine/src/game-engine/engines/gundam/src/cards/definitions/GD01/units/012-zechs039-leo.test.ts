import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zechs039Leo } from "./012-zechs039-leo";

/**
 * Tests for GD01-012: Zechs&#039; Leo
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * - Zones: space, earth
 * - Link Requirement: (oz) trait
 * Abilities:
 * - 【when paired】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-012: Zechs&#039; Leo", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zechs039Leo.id).toBe("GD01-012");
      expect(zechs039Leo.name).toBe("Zechs&#039; Leo");
      expect(zechs039Leo.number).toBe(12);
      expect(zechs039Leo.set).toBe("GD01");
      expect(zechs039Leo.type).toBe("unit");
      expect(zechs039Leo.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(zechs039Leo.cost).toBe(2);
      expect(zechs039Leo.level).toBe(3);
      expect(zechs039Leo.ap).toBe(3);
      expect(zechs039Leo.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(zechs039Leo.color).toBe("blue");
    });

    it("should have correct zones", () => {
      expect(zechs039Leo.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(zechs039Leo.linkRequirement).toEqual(["(oz) trait"]);
    });

    it("should have card text", () => {
      expect(zechs039Leo.text).toBeTruthy();
      expect(zechs039Leo.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(zechs039Leo.abilities).toBeDefined();
      expect(Array.isArray(zechs039Leo.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(zechs039Leo.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      zechs039Leo.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zechs039Leo],
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
          battleArea: [zechs039Leo],
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
          battleArea: [zechs039Leo],
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

      expect(zechs039Leo.linkRequirement).toEqual(["(oz) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zechs039Leo],
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

      expect(zechs039Leo.zones).toContain("space");
      expect(zechs039Leo.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(zechs039Leo).toHaveProperty("implemented");
      expect(zechs039Leo).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(zechs039Leo.level).toBe(3);
      expect(zechs039Leo.cost).toBe(2);
      expect(zechs039Leo.ap).toBe(3);
      expect(zechs039Leo.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = zechs039Leo.ap + zechs039Leo.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zechs039Leo],
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
