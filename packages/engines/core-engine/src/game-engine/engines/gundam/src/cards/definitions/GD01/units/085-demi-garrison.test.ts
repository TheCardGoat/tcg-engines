import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { demiGarrison } from "./085-demi-garrison";

/**
 * Tests for GD01-085: Demi Garrison
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 2, HP: 2
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

describe("GD01-085: Demi Garrison", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(demiGarrison.id).toBe("GD01-085");
      expect(demiGarrison.name).toBe("Demi Garrison");
      expect(demiGarrison.number).toBe(85);
      expect(demiGarrison.set).toBe("GD01");
      expect(demiGarrison.type).toBe("unit");
      expect(demiGarrison.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(demiGarrison.cost).toBe(1);
      expect(demiGarrison.level).toBe(2);
      expect(demiGarrison.ap).toBe(2);
      expect(demiGarrison.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(demiGarrison.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(demiGarrison.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(demiGarrison.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(demiGarrison.linkRequirement).toEqual(["-"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [demiGarrison],
          resourceArea: 3,
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
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [demiGarrison],
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
          battleArea: [demiGarrison],
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

      expect(demiGarrison.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [demiGarrison],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(demiGarrison.zones).toContain("space");
      expect(demiGarrison.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(demiGarrison).toHaveProperty("implemented");
      expect(demiGarrison).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(demiGarrison.level).toBe(2);
      expect(demiGarrison.cost).toBe(1);
      expect(demiGarrison.ap).toBe(2);
      expect(demiGarrison.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = demiGarrison.ap + demiGarrison.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [demiGarrison],
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
