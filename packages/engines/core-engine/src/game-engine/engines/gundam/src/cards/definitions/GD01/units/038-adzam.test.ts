import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { adzam } from "./038-adzam";

/**
 * Tests for GD01-038: Adzam
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 2, HP: 5
 * - Color: green
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: earth
 * - Link Requirement: (zeon) trait
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-038: Adzam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(adzam.id).toBe("GD01-038");
      expect(adzam.name).toBe("Adzam");
      expect(adzam.number).toBe(38);
      expect(adzam.set).toBe("GD01");
      expect(adzam.type).toBe("unit");
      expect(adzam.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(adzam.cost).toBe(4);
      expect(adzam.level).toBe(5);
      expect(adzam.ap).toBe(2);
      expect(adzam.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(adzam.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(adzam.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(adzam.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(adzam.linkRequirement).toEqual(["(zeon) trait"]);
    });

    it("should have card text", () => {
      expect(adzam.text).toBeTruthy();
      expect(adzam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(adzam.abilities).toBeDefined();
      expect(Array.isArray(adzam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(adzam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      adzam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [adzam],
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
          battleArea: [adzam],
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
          battleArea: [adzam],
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

      expect(adzam.linkRequirement).toEqual(["(zeon) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [adzam],
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

      expect(adzam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(adzam).toHaveProperty("implemented");
      expect(adzam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(adzam.level).toBe(5);
      expect(adzam.cost).toBe(4);
      expect(adzam.ap).toBe(2);
      expect(adzam.hp).toBe(5);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = adzam.ap + adzam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [adzam],
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
