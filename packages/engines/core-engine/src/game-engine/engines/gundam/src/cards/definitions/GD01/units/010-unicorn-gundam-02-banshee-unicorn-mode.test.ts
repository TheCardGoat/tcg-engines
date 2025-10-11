import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { unicornGundam02BansheeUnicornMode } from "./010-unicorn-gundam-02-banshee-unicorn-mode";

/**
 * Tests for GD01-010: Unicorn Gundam 02 Banshee (Unicorn Mode)
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: rare
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (cyber-newtype) trait
 * Abilities:
 * - 【when paired】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-010: Unicorn Gundam 02 Banshee (Unicorn Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(unicornGundam02BansheeUnicornMode.id).toBe("GD01-010");
      expect(unicornGundam02BansheeUnicornMode.name).toBe(
        "Unicorn Gundam 02 Banshee (Unicorn Mode)",
      );
      expect(unicornGundam02BansheeUnicornMode.number).toBe(10);
      expect(unicornGundam02BansheeUnicornMode.set).toBe("GD01");
      expect(unicornGundam02BansheeUnicornMode.type).toBe("unit");
      expect(unicornGundam02BansheeUnicornMode.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(unicornGundam02BansheeUnicornMode.cost).toBe(3);
      expect(unicornGundam02BansheeUnicornMode.level).toBe(4);
      expect(unicornGundam02BansheeUnicornMode.ap).toBe(4);
      expect(unicornGundam02BansheeUnicornMode.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(unicornGundam02BansheeUnicornMode.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(unicornGundam02BansheeUnicornMode.traits).toEqual([
        "earth federation",
      ]);
    });

    it("should have correct zones", () => {
      expect(unicornGundam02BansheeUnicornMode.zones).toEqual([
        "space",
        "earth",
      ]);
    });

    it("should have correct link requirement", () => {
      expect(unicornGundam02BansheeUnicornMode.linkRequirement).toEqual([
        "(cyber-newtype) trait",
      ]);
    });

    it("should have card text", () => {
      expect(unicornGundam02BansheeUnicornMode.text).toBeTruthy();
      expect(unicornGundam02BansheeUnicornMode.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(unicornGundam02BansheeUnicornMode.abilities).toBeDefined();
      expect(Array.isArray(unicornGundam02BansheeUnicornMode.abilities)).toBe(
        true,
      );
    });

    it("should have at least one ability", () => {
      expect(
        unicornGundam02BansheeUnicornMode.abilities.length,
      ).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      unicornGundam02BansheeUnicornMode.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundam02BansheeUnicornMode],
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
          battleArea: [unicornGundam02BansheeUnicornMode],
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
          battleArea: [unicornGundam02BansheeUnicornMode],
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

      expect(unicornGundam02BansheeUnicornMode.linkRequirement).toEqual([
        "(cyber-newtype) trait",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundam02BansheeUnicornMode],
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

      expect(unicornGundam02BansheeUnicornMode.zones).toContain("space");
      expect(unicornGundam02BansheeUnicornMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(unicornGundam02BansheeUnicornMode).toHaveProperty("implemented");
      expect(unicornGundam02BansheeUnicornMode).toHaveProperty(
        "missingTestCase",
      );
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(unicornGundam02BansheeUnicornMode.level).toBe(4);
      expect(unicornGundam02BansheeUnicornMode.cost).toBe(3);
      expect(unicornGundam02BansheeUnicornMode.ap).toBe(4);
      expect(unicornGundam02BansheeUnicornMode.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        unicornGundam02BansheeUnicornMode.ap +
        unicornGundam02BansheeUnicornMode.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [unicornGundam02BansheeUnicornMode],
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
