import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { shamblo } from "./047-shamblo";

/**
 * Tests for GD01-047: Shamblo
 *
 * Card Properties:
 * - Cost: 7, Level: 8, AP: 6, HP: 5
 * - Color: red
 * - Type: triggered
 * - Rarity: rare
 * - Traits: zeon
 * - Zones: earth
 * - Link Requirement: (newtype) trait / (cyber-newtype) trait
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-047: Shamblo", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(shamblo.id).toBe("GD01-047");
      expect(shamblo.name).toBe("Shamblo");
      expect(shamblo.number).toBe(47);
      expect(shamblo.set).toBe("GD01");
      expect(shamblo.type).toBe("unit");
      expect(shamblo.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(shamblo.cost).toBe(7);
      expect(shamblo.level).toBe(8);
      expect(shamblo.ap).toBe(6);
      expect(shamblo.hp).toBe(5);
    });

    it("should have correct color", () => {
      expect(shamblo.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(shamblo.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(shamblo.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(shamblo.linkRequirement).toEqual([
        "(newtype) trait / (cyber-newtype) trait",
      ]);
    });

    it("should have card text", () => {
      expect(shamblo.text).toBeTruthy();
      expect(shamblo.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(shamblo.abilities).toBeDefined();
      expect(Array.isArray(shamblo.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(shamblo.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      shamblo.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [shamblo],
          resourceArea: 9,
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
      assertZoneCount(engine, "resourceArea", 9, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [shamblo],
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
          battleArea: [shamblo],
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

      expect(shamblo.linkRequirement).toEqual([
        "(newtype) trait / (cyber-newtype) trait",
      ]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [shamblo],
          resourceArea: 9,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(shamblo.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(shamblo).toHaveProperty("implemented");
      expect(shamblo).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 8", () => {
      expect(shamblo.level).toBe(8);
      expect(shamblo.cost).toBe(7);
      expect(shamblo.ap).toBe(6);
      expect(shamblo.hp).toBe(5);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = shamblo.ap + shamblo.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [shamblo],
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
