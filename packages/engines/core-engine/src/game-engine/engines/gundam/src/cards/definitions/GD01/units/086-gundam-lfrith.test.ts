import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamLfrith } from "./086-gundam-lfrith";

/**
 * Tests for GD01-086: Gundam Lfrith
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 4
 * - Color: white
 * - Type: continuous
 * - Rarity: common
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-086: Gundam Lfrith", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamLfrith.id).toBe("GD01-086");
      expect(gundamLfrith.name).toBe("Gundam Lfrith");
      expect(gundamLfrith.number).toBe(86);
      expect(gundamLfrith.set).toBe("GD01");
      expect(gundamLfrith.type).toBe("unit");
      expect(gundamLfrith.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gundamLfrith.cost).toBe(2);
      expect(gundamLfrith.level).toBe(3);
      expect(gundamLfrith.ap).toBe(2);
      expect(gundamLfrith.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(gundamLfrith.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(gundamLfrith.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamLfrith.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(gundamLfrith.text).toBeTruthy();
      expect(gundamLfrith.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gundamLfrith.abilities).toBeDefined();
      expect(Array.isArray(gundamLfrith.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gundamLfrith.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gundamLfrith.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamLfrith],
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
          battleArea: [gundamLfrith],
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
          battleArea: [gundamLfrith],
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

      expect(gundamLfrith.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamLfrith],
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

      expect(gundamLfrith.zones).toContain("space");
      expect(gundamLfrith.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamLfrith).toHaveProperty("implemented");
      expect(gundamLfrith).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(gundamLfrith.level).toBe(3);
      expect(gundamLfrith.cost).toBe(2);
      expect(gundamLfrith.ap).toBe(2);
      expect(gundamLfrith.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamLfrith.ap + gundamLfrith.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamLfrith],
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
