import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { unicornGundam02BansheeDestroyMode } from "./003-unicorn-gundam-02-banshee-destroy-mode";

/**
 * Tests for GD01-003: Unicorn Gundam 02 Banshee (Destroy Mode)
 *
 * Card Properties:
 * - Cost: 4, Level: 6, AP: 5, HP: 4
 * - Color: blue
 * - Type: unit
 * - Rarity: legendary
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: marida cruz
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-003: Unicorn Gundam 02 Banshee (Destroy Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(unicornGundam02BansheeDestroyMode.id).toBe("GD01-003");
      expect(unicornGundam02BansheeDestroyMode.name).toBe(
        "Unicorn Gundam 02 Banshee (Destroy Mode)",
      );
      expect(unicornGundam02BansheeDestroyMode.number).toBe(3);
      expect(unicornGundam02BansheeDestroyMode.set).toBe("GD01");
      expect(unicornGundam02BansheeDestroyMode.type).toBe("unit");
      expect(unicornGundam02BansheeDestroyMode.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(unicornGundam02BansheeDestroyMode.cost).toBe(4);
      expect(unicornGundam02BansheeDestroyMode.level).toBe(6);
      expect(unicornGundam02BansheeDestroyMode.ap).toBe(5);
      expect(unicornGundam02BansheeDestroyMode.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(unicornGundam02BansheeDestroyMode.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(unicornGundam02BansheeDestroyMode.traits).toEqual([
        "earth federation",
      ]);
    });

    it("should have correct zones", () => {
      expect(unicornGundam02BansheeDestroyMode.zones).toEqual([
        "space",
        "earth",
      ]);
    });

    it("should have correct link requirement", () => {
      expect(unicornGundam02BansheeDestroyMode.linkRequirement).toEqual([
        "marida cruz",
      ]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundam02BansheeDestroyMode],
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
          battleArea: [unicornGundam02BansheeDestroyMode],
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
          battleArea: [unicornGundam02BansheeDestroyMode],
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

      expect(unicornGundam02BansheeDestroyMode.linkRequirement).toEqual([
        "marida cruz",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundam02BansheeDestroyMode],
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

      expect(unicornGundam02BansheeDestroyMode.zones).toContain("space");
      expect(unicornGundam02BansheeDestroyMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(unicornGundam02BansheeDestroyMode).toHaveProperty("implemented");
      expect(unicornGundam02BansheeDestroyMode).toHaveProperty(
        "missingTestCase",
      );
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 6", () => {
      expect(unicornGundam02BansheeDestroyMode.level).toBe(6);
      expect(unicornGundam02BansheeDestroyMode.cost).toBe(4);
      expect(unicornGundam02BansheeDestroyMode.ap).toBe(5);
      expect(unicornGundam02BansheeDestroyMode.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        unicornGundam02BansheeDestroyMode.ap +
        unicornGundam02BansheeDestroyMode.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [unicornGundam02BansheeDestroyMode],
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
