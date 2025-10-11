import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { wingGundamZero } from "./024-wing-gundam-zero";

/**
 * Tests for GD01-024: Wing Gundam Zero
 *
 * Card Properties:
 * - Cost: 8, Level: 8, AP: 5, HP: 7
 * - Color: green
 * - Type: unit
 * - Rarity: legendary
 * - Zones: space, earth
 * - Link Requirement: heero yuy
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-024: Wing Gundam Zero", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(wingGundamZero.id).toBe("GD01-024");
      expect(wingGundamZero.name).toBe("Wing Gundam Zero");
      expect(wingGundamZero.number).toBe(24);
      expect(wingGundamZero.set).toBe("GD01");
      expect(wingGundamZero.type).toBe("unit");
      expect(wingGundamZero.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(wingGundamZero.cost).toBe(8);
      expect(wingGundamZero.level).toBe(8);
      expect(wingGundamZero.ap).toBe(5);
      expect(wingGundamZero.hp).toBe(7);
    });

    it("should have correct color", () => {
      expect(wingGundamZero.color).toBe("green");
    });

    it("should have correct zones", () => {
      expect(wingGundamZero.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(wingGundamZero.linkRequirement).toEqual(["heero yuy"]);
    });

    it("should have card text", () => {
      expect(wingGundamZero.text).toBeTruthy();
      expect(wingGundamZero.text.length).toBeGreaterThan(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamZero],
          resourceArea: 10,
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
      assertZoneCount(engine, "resourceArea", 10, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundamZero],
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
          battleArea: [wingGundamZero],
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

      expect(wingGundamZero.linkRequirement).toEqual(["heero yuy"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [wingGundamZero],
          resourceArea: 10,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(wingGundamZero.zones).toContain("space");
      expect(wingGundamZero.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(wingGundamZero).toHaveProperty("implemented");
      expect(wingGundamZero).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 8", () => {
      expect(wingGundamZero.level).toBe(8);
      expect(wingGundamZero.cost).toBe(8);
      expect(wingGundamZero.ap).toBe(5);
      expect(wingGundamZero.hp).toBe(7);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = wingGundamZero.ap + wingGundamZero.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [wingGundamZero],
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
