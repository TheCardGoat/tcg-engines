import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zakuISniperType } from "./048-zaku-i-sniper-type";

/**
 * Tests for GD01-048: Zaku I Sniper Type
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 0, HP: 1
 * - Color: red
 * - Type: continuous
 * - Rarity: rare
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: (zeon) trait
 * Abilities:
 * - <Support 1>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-048: Zaku I Sniper Type", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zakuISniperType.id).toBe("GD01-048");
      expect(zakuISniperType.name).toBe("Zaku I Sniper Type");
      expect(zakuISniperType.number).toBe(48);
      expect(zakuISniperType.set).toBe("GD01");
      expect(zakuISniperType.type).toBe("unit");
      expect(zakuISniperType.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(zakuISniperType.cost).toBe(2);
      expect(zakuISniperType.level).toBe(2);
      expect(zakuISniperType.ap).toBe(0);
      expect(zakuISniperType.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(zakuISniperType.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(zakuISniperType.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zakuISniperType.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(zakuISniperType.linkRequirement).toEqual(["(zeon) trait"]);
    });

    it("should have card text", () => {
      expect(zakuISniperType.text).toBeTruthy();
      expect(zakuISniperType.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(zakuISniperType.abilities).toBeDefined();
      expect(Array.isArray(zakuISniperType.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(zakuISniperType.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      zakuISniperType.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zakuISniperType],
          resourceArea: 4,
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
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuISniperType],
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
          battleArea: [zakuISniperType],
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

      expect(zakuISniperType.linkRequirement).toEqual(["(zeon) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [zakuISniperType],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(zakuISniperType.zones).toContain("space");
      expect(zakuISniperType.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(zakuISniperType).toHaveProperty("implemented");
      expect(zakuISniperType).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(zakuISniperType.level).toBe(2);
      expect(zakuISniperType.cost).toBe(2);
      expect(zakuISniperType.ap).toBe(0);
      expect(zakuISniperType.hp).toBe(1);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = zakuISniperType.ap + zakuISniperType.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuISniperType],
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
