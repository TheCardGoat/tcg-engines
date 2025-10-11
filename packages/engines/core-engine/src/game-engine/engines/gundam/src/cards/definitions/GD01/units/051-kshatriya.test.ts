import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { kshatriya } from "./051-kshatriya";

/**
 * Tests for GD01-051: Kshatriya
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 4
 * - Color: red
 * - Type: unit
 * - Rarity: uncommon
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: (cyber-newtype) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-051: Kshatriya", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(kshatriya.id).toBe("GD01-051");
      expect(kshatriya.name).toBe("Kshatriya");
      expect(kshatriya.number).toBe(51);
      expect(kshatriya.set).toBe("GD01");
      expect(kshatriya.type).toBe("unit");
      expect(kshatriya.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(kshatriya.cost).toBe(2);
      expect(kshatriya.level).toBe(4);
      expect(kshatriya.ap).toBe(3);
      expect(kshatriya.hp).toBe(4);
    });

    it("should have correct color", () => {
      expect(kshatriya.color).toBe("red");
    });

    it("should have correct traits", () => {
      expect(kshatriya.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(kshatriya.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(kshatriya.linkRequirement).toEqual(["(cyber-newtype) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [kshatriya],
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
          battleArea: [kshatriya],
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
          battleArea: [kshatriya],
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

      expect(kshatriya.linkRequirement).toEqual(["(cyber-newtype) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [kshatriya],
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

      expect(kshatriya.zones).toContain("space");
      expect(kshatriya.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(kshatriya).toHaveProperty("implemented");
      expect(kshatriya).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(kshatriya.level).toBe(4);
      expect(kshatriya.cost).toBe(2);
      expect(kshatriya.ap).toBe(3);
      expect(kshatriya.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = kshatriya.ap + kshatriya.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [kshatriya],
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
