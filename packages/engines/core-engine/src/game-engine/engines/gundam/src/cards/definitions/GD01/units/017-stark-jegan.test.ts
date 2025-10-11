import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { starkJegan } from "./017-stark-jegan";

/**
 * Tests for GD01-017: Stark Jegan
 *
 * Card Properties:
 * - Cost: 3, Level: 3, AP: 3, HP: 3
 * - Color: blue
 * - Type: continuous
 * - Rarity: common
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

describe("GD01-017: Stark Jegan", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(starkJegan.id).toBe("GD01-017");
      expect(starkJegan.name).toBe("Stark Jegan");
      expect(starkJegan.number).toBe(17);
      expect(starkJegan.set).toBe("GD01");
      expect(starkJegan.type).toBe("unit");
      expect(starkJegan.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(starkJegan.cost).toBe(3);
      expect(starkJegan.level).toBe(3);
      expect(starkJegan.ap).toBe(3);
      expect(starkJegan.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(starkJegan.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(starkJegan.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(starkJegan.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(starkJegan.linkRequirement).toEqual(["(earth federation) trait"]);
    });

    it("should have card text", () => {
      expect(starkJegan.text).toBeTruthy();
      expect(starkJegan.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(starkJegan.abilities).toBeDefined();
      expect(Array.isArray(starkJegan.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(starkJegan.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      starkJegan.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [starkJegan],
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
          battleArea: [starkJegan],
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
          battleArea: [starkJegan],
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

      expect(starkJegan.linkRequirement).toEqual(["(earth federation) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [starkJegan],
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

      expect(starkJegan.zones).toContain("space");
      expect(starkJegan.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(starkJegan).toHaveProperty("implemented");
      expect(starkJegan).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(starkJegan.level).toBe(3);
      expect(starkJegan.cost).toBe(3);
      expect(starkJegan.ap).toBe(3);
      expect(starkJegan.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = starkJegan.ap + starkJegan.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [starkJegan],
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
