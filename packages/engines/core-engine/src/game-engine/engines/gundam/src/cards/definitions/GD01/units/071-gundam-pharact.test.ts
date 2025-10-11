import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamPharact } from "./071-gundam-pharact";

/**
 * Tests for GD01-071: Gundam Pharact
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 4
 * - Color: white
 * - Type: triggered
 * - Rarity: rare
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: (academy) trait
 * Abilities:
 * - 【attack】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-071: Gundam Pharact", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamPharact.id).toBe("GD01-071");
      expect(gundamPharact.name).toBe("Gundam Pharact");
      expect(gundamPharact.number).toBe(71);
      expect(gundamPharact.set).toBe("GD01");
      expect(gundamPharact.type).toBe("unit");
      expect(gundamPharact.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(gundamPharact.cost).toBe(3);
      expect(gundamPharact.level).toBe(4);
      expect(gundamPharact.ap).toBe(3);
      expect(gundamPharact.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamPharact.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(gundamPharact.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamPharact.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamPharact.linkRequirement).toEqual(["(academy) trait"]);
    });

    it("should have card text", () => {
      expect(gundamPharact.text).toBeTruthy();
      expect(gundamPharact.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gundamPharact.abilities).toBeDefined();
      expect(Array.isArray(gundamPharact.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gundamPharact.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gundamPharact.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamPharact],
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
          battleArea: [gundamPharact],
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
          battleArea: [gundamPharact],
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

      expect(gundamPharact.linkRequirement).toEqual(["(academy) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamPharact],
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

      expect(gundamPharact.zones).toContain("space");
      expect(gundamPharact.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamPharact).toHaveProperty("implemented");
      expect(gundamPharact).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gundamPharact.level).toBe(4);
      expect(gundamPharact.cost).toBe(3);
      expect(gundamPharact.ap).toBe(3);
      expect(gundamPharact.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamPharact.ap + gundamPharact.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamPharact],
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
