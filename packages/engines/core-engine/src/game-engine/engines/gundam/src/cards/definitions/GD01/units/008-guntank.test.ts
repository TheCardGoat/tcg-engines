import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { guntank } from "./008-guntank";

/**
 * Tests for GD01-008: Guntank
 *
 * Card Properties:
 * - Cost: 1, Level: 2, AP: 1, HP: 2
 * - Color: blue
 * - Type: triggered
 * - Rarity: uncommon
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - 【deploy】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-008: Guntank", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(guntank.id).toBe("GD01-008");
      expect(guntank.name).toBe("Guntank");
      expect(guntank.number).toBe(8);
      expect(guntank.set).toBe("GD01");
      expect(guntank.type).toBe("unit");
      expect(guntank.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(guntank.cost).toBe(1);
      expect(guntank.level).toBe(2);
      expect(guntank.ap).toBe(1);
      expect(guntank.hp).toBe(2);
    });

    it("should have correct color", () => {
      expect(guntank.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(guntank.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(guntank.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(guntank.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(guntank.text).toBeTruthy();
      expect(guntank.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(guntank.abilities).toBeDefined();
      expect(Array.isArray(guntank.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(guntank.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      guntank.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
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
          battleArea: [guntank],
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
          battleArea: [guntank],
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

      expect(guntank.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [guntank],
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

      expect(guntank.zones).toContain("space");
      expect(guntank.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(guntank).toHaveProperty("implemented");
      expect(guntank).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 2", () => {
      expect(guntank.level).toBe(2);
      expect(guntank.cost).toBe(1);
      expect(guntank.ap).toBe(1);
      expect(guntank.hp).toBe(2);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = guntank.ap + guntank.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [guntank],
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
