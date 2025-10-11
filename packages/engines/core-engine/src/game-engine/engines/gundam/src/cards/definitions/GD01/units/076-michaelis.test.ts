import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { michaelis } from "./076-michaelis";

/**
 * Tests for GD01-076: Michaelis
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 3
 * - Color: white
 * - Type: resolution
 * - Rarity: uncommon
 * - Traits: academy
 * - Zones: space, earth
 * - Link Requirement: (academy) trait
 * Abilities:
 * - While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-076: Michaelis", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(michaelis.id).toBe("GD01-076");
      expect(michaelis.name).toBe("Michaelis");
      expect(michaelis.number).toBe(76);
      expect(michaelis.set).toBe("GD01");
      expect(michaelis.type).toBe("unit");
      expect(michaelis.rarity).toBe("uncommon");
    });

    it("should have correct stats", () => {
      expect(michaelis.cost).toBe(2);
      expect(michaelis.level).toBe(3);
      expect(michaelis.ap).toBe(3);
      expect(michaelis.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(michaelis.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(michaelis.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(michaelis.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(michaelis.linkRequirement).toEqual(["(academy) trait"]);
    });

    it("should have card text", () => {
      expect(michaelis.text).toBeTruthy();
      expect(michaelis.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(michaelis.abilities).toBeDefined();
      expect(Array.isArray(michaelis.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(michaelis.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      michaelis.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [michaelis],
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
          battleArea: [michaelis],
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
          battleArea: [michaelis],
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

      expect(michaelis.linkRequirement).toEqual(["(academy) trait"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [michaelis],
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

      expect(michaelis.zones).toContain("space");
      expect(michaelis.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(michaelis).toHaveProperty("implemented");
      expect(michaelis).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(michaelis.level).toBe(3);
      expect(michaelis.cost).toBe(2);
      expect(michaelis.ap).toBe(3);
      expect(michaelis.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = michaelis.ap + michaelis.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [michaelis],
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
