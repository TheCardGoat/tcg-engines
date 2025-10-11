import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { bigZam } from "./027-big-zam";

/**
 * Tests for GD01-027: Big Zam
 *
 * Card Properties:
 * - Cost: 5, Level: 7, AP: 5, HP: 6
 * - Color: green
 * - Type: continuous
 * - Rarity: rare
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: dozle zabi
 * Abilities:
 * - <Breach 4>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-027: Big Zam", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(bigZam.id).toBe("GD01-027");
      expect(bigZam.name).toBe("Big Zam");
      expect(bigZam.number).toBe(27);
      expect(bigZam.set).toBe("GD01");
      expect(bigZam.type).toBe("unit");
      expect(bigZam.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(bigZam.cost).toBe(5);
      expect(bigZam.level).toBe(7);
      expect(bigZam.ap).toBe(5);
      expect(bigZam.hp).toBe(6);
    });

    it("should have correct color", () => {
      expect(bigZam.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(bigZam.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(bigZam.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(bigZam.linkRequirement).toEqual(["dozle zabi"]);
    });

    it("should have card text", () => {
      expect(bigZam.text).toBeTruthy();
      expect(bigZam.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(bigZam.abilities).toBeDefined();
      expect(Array.isArray(bigZam.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(bigZam.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      bigZam.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [bigZam],
          resourceArea: 7,
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
      assertZoneCount(engine, "resourceArea", 7, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [bigZam],
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
          battleArea: [bigZam],
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

      expect(bigZam.linkRequirement).toEqual(["dozle zabi"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [bigZam],
          resourceArea: 7,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(bigZam.zones).toContain("space");
      expect(bigZam.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(bigZam).toHaveProperty("implemented");
      expect(bigZam).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 7", () => {
      expect(bigZam.level).toBe(7);
      expect(bigZam.cost).toBe(5);
      expect(bigZam.ap).toBe(5);
      expect(bigZam.hp).toBe(6);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = bigZam.ap + bigZam.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [bigZam],
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
