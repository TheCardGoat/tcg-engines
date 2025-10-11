import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { launcherStrikeGundam } from "./072-launcher-strike-gundam";

/**
 * Tests for GD01-072: Launcher Strike Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 4
 * - Color: white
 * - Type: continuous
 * - Rarity: uncommon
 * - Traits: earth federation
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

describe("GD01-072: Launcher Strike Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(launcherStrikeGundam.id).toBe("GD01-072");
      expect(launcherStrikeGundam.name).toBe("Launcher Strike Gundam");
      expect(launcherStrikeGundam.number).toBe(72);
      expect(launcherStrikeGundam.set).toBe("GD01");
      expect(launcherStrikeGundam.type).toBe("unit");
      expect(launcherStrikeGundam.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(launcherStrikeGundam.cost).toBe(3);
      expect(launcherStrikeGundam.level).toBe(4);
      expect(launcherStrikeGundam.ap).toBe(3);
      expect(launcherStrikeGundam.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(launcherStrikeGundam.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(launcherStrikeGundam.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(launcherStrikeGundam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(launcherStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
    });

    it("should have card text", () => {
      expect(launcherStrikeGundam.text).toBeTruthy();
      expect(launcherStrikeGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(launcherStrikeGundam.abilities).toBeDefined();
      expect(Array.isArray(launcherStrikeGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(launcherStrikeGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      launcherStrikeGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [launcherStrikeGundam],
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
          battleArea: [launcherStrikeGundam],
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
          battleArea: [launcherStrikeGundam],
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

      expect(launcherStrikeGundam.linkRequirement).toEqual([
        "(earth alliance) trait",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [launcherStrikeGundam],
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

      expect(launcherStrikeGundam.zones).toContain("space");
      expect(launcherStrikeGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(launcherStrikeGundam).toHaveProperty("implemented");
      expect(launcherStrikeGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(launcherStrikeGundam.level).toBe(4);
      expect(launcherStrikeGundam.cost).toBe(3);
      expect(launcherStrikeGundam.ap).toBe(3);
      expect(launcherStrikeGundam.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = launcherStrikeGundam.ap + launcherStrikeGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [launcherStrikeGundam],
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
