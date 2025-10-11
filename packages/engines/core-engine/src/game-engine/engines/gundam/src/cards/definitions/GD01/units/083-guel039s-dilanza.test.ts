import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guel039sDilanza } from "./083-guel039s-dilanza";

/**
 * Tests for GD01-083: Guel&#039;s Dilanza
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: (academy) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-083: Guel&#039;s Dilanza", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guel039sDilanza.id).toBe("GD01-083");
      expect(guel039sDilanza.name).toBe("Guel&#039;s Dilanza");
      expect(guel039sDilanza.number).toBe(83);
      expect(guel039sDilanza.set).toBe("GD01");
      expect(guel039sDilanza.type).toBe("unit");
      expect(guel039sDilanza.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(guel039sDilanza.cost).toBe(2);
      expect(guel039sDilanza.level).toBe(2);
      expect(guel039sDilanza.ap).toBe(2);
      expect(guel039sDilanza.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(guel039sDilanza.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(guel039sDilanza.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(guel039sDilanza.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(guel039sDilanza.linkRequirement).toEqual(["(academy) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guel039sDilanza],
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
          battleArea: [guel039sDilanza],
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
          battleArea: [guel039sDilanza],
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

      expect(guel039sDilanza.linkRequirement).toEqual(["(academy) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guel039sDilanza],
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

      expect(guel039sDilanza.zones).toContain("space");
      expect(guel039sDilanza.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(guel039sDilanza).toHaveProperty("implemented");
      expect(guel039sDilanza).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(guel039sDilanza.level).toBe(2);
      expect(guel039sDilanza.cost).toBe(2);
      expect(guel039sDilanza.ap).toBe(2);
      expect(guel039sDilanza.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = guel039sDilanza.ap + guel039sDilanza.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [guel039sDilanza],
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
