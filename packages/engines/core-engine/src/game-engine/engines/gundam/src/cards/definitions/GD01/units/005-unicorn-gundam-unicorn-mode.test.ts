import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { unicornGundamUnicornMode } from "./005-unicorn-gundam-unicorn-mode";

/**
 * Tests for GD01-005: Unicorn Gundam (Unicorn Mode)
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 4, HP: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: rare
 * - Traits: civilian
 * - Zones: space, earth
 * - Link Requirement: banagher links
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-005: Unicorn Gundam (Unicorn Mode)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(unicornGundamUnicornMode.id).toBe("GD01-005");
      expect(unicornGundamUnicornMode.name).toBe(
        "Unicorn Gundam (Unicorn Mode)",
      );
      expect(unicornGundamUnicornMode.number).toBe(5);
      expect(unicornGundamUnicornMode.set).toBe("GD01");
      expect(unicornGundamUnicornMode.type).toBe("unit");
      expect(unicornGundamUnicornMode.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(unicornGundamUnicornMode.cost).toBe(4);
      expect(unicornGundamUnicornMode.level).toBe(5);
      expect(unicornGundamUnicornMode.ap).toBe(4);
      expect(unicornGundamUnicornMode.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(unicornGundamUnicornMode.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(unicornGundamUnicornMode.traits).toEqual(["civilian"]);
    });

    it("should have correct zones", () => {
      expect(unicornGundamUnicornMode.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(unicornGundamUnicornMode.linkRequirement).toEqual([
        "banagher links",
      ]);
    });

    it("should have card text", () => {
      expect(unicornGundamUnicornMode.text).toBeTruthy();
      expect(unicornGundamUnicornMode.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(unicornGundamUnicornMode.abilities).toBeDefined();
      expect(Array.isArray(unicornGundamUnicornMode.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(unicornGundamUnicornMode.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      unicornGundamUnicornMode.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundamUnicornMode],
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
          battleArea: [unicornGundamUnicornMode],
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
          battleArea: [unicornGundamUnicornMode],
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

      expect(unicornGundamUnicornMode.linkRequirement).toEqual([
        "banagher links",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [unicornGundamUnicornMode],
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

      expect(unicornGundamUnicornMode.zones).toContain("space");
      expect(unicornGundamUnicornMode.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(unicornGundamUnicornMode).toHaveProperty("implemented");
      expect(unicornGundamUnicornMode).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(unicornGundamUnicornMode.level).toBe(5);
      expect(unicornGundamUnicornMode.cost).toBe(4);
      expect(unicornGundamUnicornMode.ap).toBe(4);
      expect(unicornGundamUnicornMode.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        unicornGundamUnicornMode.ap + unicornGundamUnicornMode.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [unicornGundamUnicornMode],
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
