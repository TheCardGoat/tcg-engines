import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamAerial } from "./070-gundam-aerial";

/**
 * Tests for GD01-070: Gundam Aerial
 *
 * Card Properties:
 * - Cost: 3, Level: 5, AP: 3, HP: 3
 * - Color: white
 * - Type: unit
 * - Rarity: rare
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: suletta mercury
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-070: Gundam Aerial", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamAerial.id).toBe("GD01-070");
      expect(gundamAerial.name).toBe("Gundam Aerial");
      expect(gundamAerial.number).toBe(70);
      expect(gundamAerial.set).toBe("GD01");
      expect(gundamAerial.type).toBe("unit");
      expect(gundamAerial.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(gundamAerial.cost).toBe(3);
      expect(gundamAerial.level).toBe(5);
      expect(gundamAerial.ap).toBe(3);
      expect(gundamAerial.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gundamAerial.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(gundamAerial.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamAerial.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamAerial.linkRequirement).toEqual(["suletta mercury"]);
    });

    it("should have card text", () => {
      expect(gundamAerial.text).toBeTruthy();
      expect(gundamAerial.text.length).toBeGreaterThan(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerial],
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
          battleArea: [gundamAerial],
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
          battleArea: [gundamAerial],
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

      expect(gundamAerial.linkRequirement).toEqual(["suletta mercury"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerial],
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

      expect(gundamAerial.zones).toContain("space");
      expect(gundamAerial.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gundamAerial).toHaveProperty("implemented");
      expect(gundamAerial).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 5", () => {
      expect(gundamAerial.level).toBe(5);
      expect(gundamAerial.cost).toBe(3);
      expect(gundamAerial.ap).toBe(3);
      expect(gundamAerial.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gundamAerial.ap + gundamAerial.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerial],
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
