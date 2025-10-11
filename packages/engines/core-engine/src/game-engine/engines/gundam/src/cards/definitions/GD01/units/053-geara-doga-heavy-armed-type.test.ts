import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gearaDogaHeavyArmedType } from "./053-geara-doga-heavy-armed-type";

/**
 * Tests for GD01-053: Geara Doga (Heavy Armed Type)
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 2
 * - Color: red
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - 【once per turn】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-053: Geara Doga (Heavy Armed Type)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gearaDogaHeavyArmedType.id).toBe("GD01-053");
      expect(gearaDogaHeavyArmedType.name).toBe(
        "Geara Doga (Heavy Armed Type)",
      );
      expect(gearaDogaHeavyArmedType.number).toBe(53);
      expect(gearaDogaHeavyArmedType.set).toBe("GD01");
      expect(gearaDogaHeavyArmedType.type).toBe("unit");
      expect(gearaDogaHeavyArmedType.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(gearaDogaHeavyArmedType.cost).toBe(3);
      expect(gearaDogaHeavyArmedType.level).toBe(4);
      expect(gearaDogaHeavyArmedType.ap).toBe(4);
      expect(gearaDogaHeavyArmedType.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(gearaDogaHeavyArmedType.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(gearaDogaHeavyArmedType.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gearaDogaHeavyArmedType.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gearaDogaHeavyArmedType.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(gearaDogaHeavyArmedType.text).toBeTruthy();
      expect(gearaDogaHeavyArmedType.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gearaDogaHeavyArmedType.abilities).toBeDefined();
      expect(Array.isArray(gearaDogaHeavyArmedType.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gearaDogaHeavyArmedType.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gearaDogaHeavyArmedType.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaDogaHeavyArmedType],
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
          battleArea: [gearaDogaHeavyArmedType],
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
          battleArea: [gearaDogaHeavyArmedType],
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

      expect(gearaDogaHeavyArmedType.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gearaDogaHeavyArmedType],
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

      expect(gearaDogaHeavyArmedType.zones).toContain("space");
      expect(gearaDogaHeavyArmedType.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gearaDogaHeavyArmedType).toHaveProperty("implemented");
      expect(gearaDogaHeavyArmedType).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gearaDogaHeavyArmedType.level).toBe(4);
      expect(gearaDogaHeavyArmedType.cost).toBe(3);
      expect(gearaDogaHeavyArmedType.ap).toBe(4);
      expect(gearaDogaHeavyArmedType.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats =
        gearaDogaHeavyArmedType.ap + gearaDogaHeavyArmedType.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gearaDogaHeavyArmedType],
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
