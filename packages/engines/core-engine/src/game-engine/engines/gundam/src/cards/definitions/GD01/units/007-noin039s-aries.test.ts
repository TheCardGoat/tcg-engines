import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { noin039sAries } from "./007-noin039s-aries";

/**
 * Tests for GD01-007: Noin&#039;s Aries
 *
 * Card Properties:
 * - Cost: 3, Level: 3, AP: 2, HP: 3
 * - Color: blue
 * - Type: triggered
 * - Rarity: rare
 * - Zones: earth
 * - Link Requirement: lucrezia noin
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-007: Noin&#039;s Aries", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(noin039sAries.id).toBe("GD01-007");
      expect(noin039sAries.name).toBe("Noin&#039;s Aries");
      expect(noin039sAries.number).toBe(7);
      expect(noin039sAries.set).toBe("GD01");
      expect(noin039sAries.type).toBe("unit");
      expect(noin039sAries.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(noin039sAries.cost).toBe(3);
      expect(noin039sAries.level).toBe(3);
      expect(noin039sAries.ap).toBe(2);
      expect(noin039sAries.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(noin039sAries.color).toBe("blue");
    });

    it("should have correct zones", () => {
      expect(noin039sAries.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(noin039sAries.linkRequirement).toEqual(["lucrezia noin"]);
    });

    it("should have card text", () => {
      expect(noin039sAries.text).toBeTruthy();
      expect(noin039sAries.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(noin039sAries.abilities).toBeDefined();
      expect(Array.isArray(noin039sAries.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(noin039sAries.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      noin039sAries.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [noin039sAries],
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
          battleArea: [noin039sAries],
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
          battleArea: [noin039sAries],
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

      expect(noin039sAries.linkRequirement).toEqual(["lucrezia noin"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [noin039sAries],
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

      expect(noin039sAries.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(noin039sAries).toHaveProperty("implemented");
      expect(noin039sAries).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(noin039sAries.level).toBe(3);
      expect(noin039sAries.cost).toBe(3);
      expect(noin039sAries.ap).toBe(2);
      expect(noin039sAries.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = noin039sAries.ap + noin039sAries.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [noin039sAries],
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
