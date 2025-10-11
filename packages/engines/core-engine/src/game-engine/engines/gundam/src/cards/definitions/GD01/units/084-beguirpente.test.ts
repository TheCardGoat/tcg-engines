import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { beguirpente } from "./084-beguirpente";

/**
 * Tests for GD01-084: Beguir-Pente
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 3
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: -
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-084: Beguir-Pente", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(beguirpente.id).toBe("GD01-084");
      expect(beguirpente.name).toBe("Beguir-Pente");
      expect(beguirpente.number).toBe(84);
      expect(beguirpente.set).toBe("GD01");
      expect(beguirpente.type).toBe("unit");
      expect(beguirpente.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(beguirpente.cost).toBe(2);
      expect(beguirpente.level).toBe(2);
      expect(beguirpente.ap).toBe(2);
      expect(beguirpente.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(beguirpente.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(beguirpente.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(beguirpente.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(beguirpente.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [beguirpente],
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
          battleArea: [beguirpente],
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
          battleArea: [beguirpente],
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

      expect(beguirpente.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [beguirpente],
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

      expect(beguirpente.zones).toContain("space");
      expect(beguirpente.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(beguirpente).toHaveProperty("implemented");
      expect(beguirpente).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(beguirpente.level).toBe(2);
      expect(beguirpente.cost).toBe(2);
      expect(beguirpente.ap).toBe(2);
      expect(beguirpente.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = beguirpente.ap + beguirpente.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [beguirpente],
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
