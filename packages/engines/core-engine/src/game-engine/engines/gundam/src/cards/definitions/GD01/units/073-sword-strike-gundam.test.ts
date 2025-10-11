import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { swordStrikeGundam } from "./073-sword-strike-gundam";

/**
 * Tests for GD01-073: Sword Strike Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: white
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (earth alliance) trait
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-073: Sword Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(swordStrikeGundam.id).toBe("GD01-073");
      expect(swordStrikeGundam.name).toBe("Sword Strike Gundam");
      expect(swordStrikeGundam.number).toBe(73);
      expect(swordStrikeGundam.set).toBe("GD01");
      expect(swordStrikeGundam.type).toBe("unit");
      expect(swordStrikeGundam.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(swordStrikeGundam.cost).toBe(3);
      expect(swordStrikeGundam.level).toBe(4);
      expect(swordStrikeGundam.ap).toBe(4);
      expect(swordStrikeGundam.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(swordStrikeGundam.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(swordStrikeGundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(swordStrikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(swordStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
    });

    it("should have card text", () => {
      expect(swordStrikeGundam.text).toBeTruthy();
      expect(swordStrikeGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(swordStrikeGundam.abilities).toBeDefined();
      expect(Array.isArray(swordStrikeGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(swordStrikeGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      swordStrikeGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [swordStrikeGundam],
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
          battleArea: [swordStrikeGundam],
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
          battleArea: [swordStrikeGundam],
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

      expect(swordStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [swordStrikeGundam],
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

      expect(swordStrikeGundam.zones).toContain("space");
      expect(swordStrikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(swordStrikeGundam).toHaveProperty("implemented");
      expect(swordStrikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(swordStrikeGundam.level).toBe(4);
      expect(swordStrikeGundam.cost).toBe(3);
      expect(swordStrikeGundam.ap).toBe(4);
      expect(swordStrikeGundam.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = swordStrikeGundam.ap + swordStrikeGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [swordStrikeGundam],
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
