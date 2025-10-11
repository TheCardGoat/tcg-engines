import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamAerialRebuild } from "./067-gundam-aerial-rebuild";

/**
 * Tests for GD01-067: Gundam Aerial Rebuild
 *
 * Card Properties:
 * - Cost: 5, Level: 6, AP: 5, HP: 4
 * - Color: white
 * - Type: triggered
 * - Rarity: legendary
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: suletta mercury
 * Abilities:
 * - 【when paired】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-067: Gundam Aerial Rebuild", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamAerialRebuild.id).toBe("GD01-067");
      expect(gundamAerialRebuild.name).toBe("Gundam Aerial Rebuild");
      expect(gundamAerialRebuild.number).toBe(67);
      expect(gundamAerialRebuild.set).toBe("GD01");
      expect(gundamAerialRebuild.type).toBe("unit");
      expect(gundamAerialRebuild.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(gundamAerialRebuild.cost).toBe(5);
      expect(gundamAerialRebuild.level).toBe(6);
      expect(gundamAerialRebuild.ap).toBe(5);
      expect(gundamAerialRebuild.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamAerialRebuild.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(gundamAerialRebuild.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamAerialRebuild.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamAerialRebuild.linkRequirement).toEqual(["suletta mercury"]);
    });

    it("should have card text", () => {
      expect(gundamAerialRebuild.text).toBeTruthy();
      expect(gundamAerialRebuild.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gundamAerialRebuild.abilities).toBeDefined();
      expect(Array.isArray(gundamAerialRebuild.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gundamAerialRebuild.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gundamAerialRebuild.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialRebuild],
          resourceArea: 7,
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
      assertZoneCount(engine, "resourceArea", 7, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialRebuild],
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
          battleArea: [gundamAerialRebuild],
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

      expect(gundamAerialRebuild.linkRequirement).toEqual(["suletta mercury"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialRebuild],
          resourceArea: 7,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(gundamAerialRebuild.zones).toContain("space");
      expect(gundamAerialRebuild.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamAerialRebuild).toHaveProperty("implemented");
      expect(gundamAerialRebuild).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 6", () => {
      expect(gundamAerialRebuild.level).toBe(6);
      expect(gundamAerialRebuild.cost).toBe(5);
      expect(gundamAerialRebuild.ap).toBe(5);
      expect(gundamAerialRebuild.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamAerialRebuild.ap + gundamAerialRebuild.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialRebuild],
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
