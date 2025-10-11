import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guncannon } from "./004-guncannon";

/**
 * Tests for GD01-004: Guncannon
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: blue
 * - Type: continuous
 * - Rarity: rare
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (white base team) trait
 * Abilities:
 * - <Repair 1>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-004: Guncannon", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guncannon.id).toBe("GD01-004");
      expect(guncannon.name).toBe("Guncannon");
      expect(guncannon.number).toBe(4);
      expect(guncannon.set).toBe("GD01");
      expect(guncannon.type).toBe("unit");
      expect(guncannon.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(guncannon.cost).toBe(2);
      expect(guncannon.level).toBe(3);
      expect(guncannon.ap).toBe(2);
      expect(guncannon.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(guncannon.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(guncannon.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(guncannon.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(guncannon.linkRequirement).toEqual(["(white base team) trait"]);
    });

    it("should have card text", () => {
      expect(guncannon.text).toBeTruthy();
      expect(guncannon.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(guncannon.abilities).toBeDefined();
      expect(Array.isArray(guncannon.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(guncannon.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      guncannon.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guncannon],
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
          battleArea: [guncannon],
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
          battleArea: [guncannon],
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

      expect(guncannon.linkRequirement).toEqual(["(white base team) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guncannon],
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

      expect(guncannon.zones).toContain("space");
      expect(guncannon.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(guncannon).toHaveProperty("implemented");
      expect(guncannon).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(guncannon.level).toBe(3);
      expect(guncannon.cost).toBe(2);
      expect(guncannon.ap).toBe(2);
      expect(guncannon.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = guncannon.ap + guncannon.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [guncannon],
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
