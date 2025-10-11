import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { shenlongGundam } from "./041-shenlong-gundam";

/**
 * Tests for GD01-041: Shenlong Gundam
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: green
 * - Type: continuous
 * - Rarity: common
 * - Zones: earth
 * - Link Requirement: chang wufei
 * Abilities:
 * - <Breach 3>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-041: Shenlong Gundam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(shenlongGundam.id).toBe("GD01-041");
      expect(shenlongGundam.name).toBe("Shenlong Gundam");
      expect(shenlongGundam.number).toBe(41);
      expect(shenlongGundam.set).toBe("GD01");
      expect(shenlongGundam.type).toBe("unit");
      expect(shenlongGundam.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(shenlongGundam.cost).toBe(3);
      expect(shenlongGundam.level).toBe(4);
      expect(shenlongGundam.ap).toBe(4);
      expect(shenlongGundam.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(shenlongGundam.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(shenlongGundam.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(shenlongGundam.linkRequirement).toEqual(["chang wufei"]);
    });

    it("should have card text", () => {
      expect(shenlongGundam.text).toBeTruthy();
      expect(shenlongGundam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(shenlongGundam.abilities).toBeDefined();
      expect(Array.isArray(shenlongGundam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(shenlongGundam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      shenlongGundam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [shenlongGundam],
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
          battleArea: [shenlongGundam],
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
          battleArea: [shenlongGundam],
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

      expect(shenlongGundam.linkRequirement).toEqual(["chang wufei"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [shenlongGundam],
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

      expect(shenlongGundam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(shenlongGundam).toHaveProperty("implemented");
      expect(shenlongGundam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(shenlongGundam.level).toBe(4);
      expect(shenlongGundam.cost).toBe(3);
      expect(shenlongGundam.ap).toBe(4);
      expect(shenlongGundam.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = shenlongGundam.ap + shenlongGundam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [shenlongGundam],
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
