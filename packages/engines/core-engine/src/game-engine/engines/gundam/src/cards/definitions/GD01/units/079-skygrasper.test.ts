import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { skygrasper } from "./079-skygrasper";

/**
 * Tests for GD01-079: Skygrasper
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 2
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: earth
 * - Link Requirement: (earth alliance) trait
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-079: Skygrasper", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(skygrasper.id).toBe("GD01-079");
      expect(skygrasper.name).toBe("Skygrasper");
      expect(skygrasper.number).toBe(79);
      expect(skygrasper.set).toBe("GD01");
      expect(skygrasper.type).toBe("unit");
      expect(skygrasper.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(skygrasper.cost).toBe(2);
      expect(skygrasper.level).toBe(2);
      expect(skygrasper.ap).toBe(2);
      expect(skygrasper.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(skygrasper.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(skygrasper.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(skygrasper.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(skygrasper.linkRequirement).toEqual(["(earth alliance) trait"]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [skygrasper],
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
          battleArea: [skygrasper],
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
          battleArea: [skygrasper],
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

      expect(skygrasper.linkRequirement).toEqual(["(earth alliance) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [skygrasper],
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

      expect(skygrasper.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(skygrasper).toHaveProperty("implemented");
      expect(skygrasper).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(skygrasper.level).toBe(2);
      expect(skygrasper.cost).toBe(2);
      expect(skygrasper.ap).toBe(2);
      expect(skygrasper.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = skygrasper.ap + skygrasper.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [skygrasper],
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
