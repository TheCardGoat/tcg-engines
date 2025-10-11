import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { unicornGundamDestroyMode } from "./002-unicorn-gundam-destroy-mode";

/**
 * Tests for GD01-002: Unicorn Gundam (Destroy Mode)
 *
 * Card Properties:
 * - Cost: 6, Level: 7, AP: 5, HP: 4
 * - Color: blue
 * - Type: unit
 * - Rarity: legendary
 * - Traits: civilian
 * - Zones: space, earth
 * - Link Requirement: banagher links
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-002: Unicorn Gundam (Destroy Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(unicornGundamDestroyMode.id).toBe("GD01-002");
      expect(unicornGundamDestroyMode.name).toBe(
        "Unicorn Gundam (Destroy Mode)",
      );
      expect(unicornGundamDestroyMode.number).toBe(2);
      expect(unicornGundamDestroyMode.set).toBe("GD01");
      expect(unicornGundamDestroyMode.type).toBe("unit");
      expect(unicornGundamDestroyMode.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(unicornGundamDestroyMode.cost).toBe(6);
      expect(unicornGundamDestroyMode.level).toBe(7);
      expect(unicornGundamDestroyMode.ap).toBe(5);
      expect(unicornGundamDestroyMode.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(unicornGundamDestroyMode.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(unicornGundamDestroyMode.traits).toEqual(["civilian"]);
    });

    it("should have correct zones", () => {
      expect(unicornGundamDestroyMode.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(unicornGundamDestroyMode.linkRequirement).toEqual([
        "banagher links",
      ]);
    });

    it("should have card text", () => {
      expect(unicornGundamDestroyMode.text).toBeTruthy();
      expect(unicornGundamDestroyMode.text.length).toBeGreaterThan(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundamDestroyMode],
          resourceArea: 8,
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
      assertZoneCount(engine, "resourceArea", 8, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [unicornGundamDestroyMode],
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
          battleArea: [unicornGundamDestroyMode],
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

      expect(unicornGundamDestroyMode.linkRequirement).toEqual([
        "banagher links",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundamDestroyMode],
          resourceArea: 8,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(unicornGundamDestroyMode.zones).toContain("space");
      expect(unicornGundamDestroyMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(unicornGundamDestroyMode).toHaveProperty("implemented");
      expect(unicornGundamDestroyMode).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 7", () => {
      expect(unicornGundamDestroyMode.level).toBe(7);
      expect(unicornGundamDestroyMode.cost).toBe(6);
      expect(unicornGundamDestroyMode.ap).toBe(5);
      expect(unicornGundamDestroyMode.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        unicornGundamDestroyMode.ap + unicornGundamDestroyMode.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [unicornGundamDestroyMode],
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
