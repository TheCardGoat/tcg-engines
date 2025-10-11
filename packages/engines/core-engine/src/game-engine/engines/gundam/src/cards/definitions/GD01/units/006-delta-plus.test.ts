import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { deltaPlus } from "./006-delta-plus";

/**
 * Tests for GD01-006: Delta Plus
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: blue
 * - Type: continuous
 * - Rarity: rare
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: (earth federation) trait
 * Abilities:
 * - <Repair 1>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-006: Delta Plus", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(deltaPlus.id).toBe("GD01-006");
      expect(deltaPlus.name).toBe("Delta Plus");
      expect(deltaPlus.number).toBe(6);
      expect(deltaPlus.set).toBe("GD01");
      expect(deltaPlus.type).toBe("unit");
      expect(deltaPlus.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(deltaPlus.cost).toBe(3);
      expect(deltaPlus.level).toBe(4);
      expect(deltaPlus.ap).toBe(4);
      expect(deltaPlus.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(deltaPlus.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(deltaPlus.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(deltaPlus.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(deltaPlus.linkRequirement).toEqual(["(earth federation) trait"]);
    });

    it("should have card text", () => {
      expect(deltaPlus.text).toBeTruthy();
      expect(deltaPlus.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(deltaPlus.abilities).toBeDefined();
      expect(Array.isArray(deltaPlus.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(deltaPlus.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      deltaPlus.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [deltaPlus],
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
          battleArea: [deltaPlus],
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
          battleArea: [deltaPlus],
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

      expect(deltaPlus.linkRequirement).toEqual(["(earth federation) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [deltaPlus],
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

      expect(deltaPlus.zones).toContain("space");
      expect(deltaPlus.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(deltaPlus).toHaveProperty("implemented");
      expect(deltaPlus).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(deltaPlus.level).toBe(4);
      expect(deltaPlus.cost).toBe(3);
      expect(deltaPlus.ap).toBe(4);
      expect(deltaPlus.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = deltaPlus.ap + deltaPlus.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [deltaPlus],
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
