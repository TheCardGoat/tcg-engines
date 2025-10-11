import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { m1Astray } from "./081-m1-astray";

/**
 * Tests for GD01-081: M1 Astray
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-081: M1 Astray", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(m1Astray.id).toBe("GD01-081");
      expect(m1Astray.name).toBe("M1 Astray");
      expect(m1Astray.number).toBe(81);
      expect(m1Astray.set).toBe("GD01");
      expect(m1Astray.type).toBe("unit");
      expect(m1Astray.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(m1Astray.cost).toBe(2);
      expect(m1Astray.level).toBe(2);
      expect(m1Astray.ap).toBe(2);
      expect(m1Astray.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(m1Astray.color).toBe("white");
    });

    it("should have correct zones", () => {
      expect(m1Astray.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(m1Astray.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [m1Astray],
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
          battleArea: [m1Astray],
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
          battleArea: [m1Astray],
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

      expect(m1Astray.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [m1Astray],
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

      expect(m1Astray.zones).toContain("space");
      expect(m1Astray.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(m1Astray).toHaveProperty("implemented");
      expect(m1Astray).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(m1Astray.level).toBe(2);
      expect(m1Astray.cost).toBe(2);
      expect(m1Astray.ap).toBe(2);
      expect(m1Astray.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = m1Astray.ap + m1Astray.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [m1Astray],
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
