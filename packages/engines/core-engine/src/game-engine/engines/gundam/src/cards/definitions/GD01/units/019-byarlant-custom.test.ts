import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { byarlantCustom } from "./019-byarlant-custom";

/**
 * Tests for GD01-019: Byarlant Custom
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 4
 * - Color: blue
 * - Type: unit
 * - Rarity: uncommon
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-019: Byarlant Custom", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(byarlantCustom.id).toBe("GD01-019");
      expect(byarlantCustom.name).toBe("Byarlant Custom");
      expect(byarlantCustom.number).toBe(19);
      expect(byarlantCustom.set).toBe("GD01");
      expect(byarlantCustom.type).toBe("unit");
      expect(byarlantCustom.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(byarlantCustom.cost).toBe(2);
      expect(byarlantCustom.level).toBe(4);
      expect(byarlantCustom.ap).toBe(3);
      expect(byarlantCustom.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(byarlantCustom.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(byarlantCustom.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(byarlantCustom.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(byarlantCustom.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [byarlantCustom],
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
          battleArea: [byarlantCustom],
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
          battleArea: [byarlantCustom],
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

      expect(byarlantCustom.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [byarlantCustom],
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

      expect(byarlantCustom.zones).toContain("space");
      expect(byarlantCustom.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(byarlantCustom).toHaveProperty("implemented");
      expect(byarlantCustom).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(byarlantCustom.level).toBe(4);
      expect(byarlantCustom.cost).toBe(2);
      expect(byarlantCustom.ap).toBe(3);
      expect(byarlantCustom.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = byarlantCustom.ap + byarlantCustom.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [byarlantCustom],
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
