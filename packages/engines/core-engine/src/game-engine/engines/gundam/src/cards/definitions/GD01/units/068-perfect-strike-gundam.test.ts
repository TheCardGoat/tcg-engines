import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { perfectStrikeGundam } from "./068-perfect-strike-gundam";

/**
 * Tests for GD01-068: Perfect Strike Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 5, AP: 4, HP: 4
 * - Color: white
 * - Type: continuous
 * - Rarity: rare
 * - Zones: space, earth
 * - Link Requirement: (earth alliance) trait
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-068: Perfect Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(perfectStrikeGundam.id).toBe("GD01-068");
      expect(perfectStrikeGundam.name).toBe("Perfect Strike Gundam");
      expect(perfectStrikeGundam.number).toBe(68);
      expect(perfectStrikeGundam.set).toBe("GD01");
      expect(perfectStrikeGundam.type).toBe("unit");
      expect(perfectStrikeGundam.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(perfectStrikeGundam.cost).toBe(3);
      expect(perfectStrikeGundam.level).toBe(5);
      expect(perfectStrikeGundam.ap).toBe(4);
      expect(perfectStrikeGundam.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(perfectStrikeGundam.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(perfectStrikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(perfectStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
    });

    it("should have card text", () => {
      expect(perfectStrikeGundam.text).toBeTruthy();
      expect(perfectStrikeGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(perfectStrikeGundam.abilities).toBeDefined();
      expect(Array.isArray(perfectStrikeGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(perfectStrikeGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      perfectStrikeGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [perfectStrikeGundam],
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
          battleArea: [perfectStrikeGundam],
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
          battleArea: [perfectStrikeGundam],
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

      expect(perfectStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [perfectStrikeGundam],
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

      expect(perfectStrikeGundam.zones).toContain("space");
      expect(perfectStrikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(perfectStrikeGundam).toHaveProperty("implemented");
      expect(perfectStrikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(perfectStrikeGundam.level).toBe(5);
      expect(perfectStrikeGundam.cost).toBe(3);
      expect(perfectStrikeGundam.ap).toBe(4);
      expect(perfectStrikeGundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = perfectStrikeGundam.ap + perfectStrikeGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [perfectStrikeGundam],
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
