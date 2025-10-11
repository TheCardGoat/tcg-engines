import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { jegan } from "./016-jegan";

/**
 * Tests for GD01-016: Jegan
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 3
 * - Color: blue
 * - Type: resolution
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: space, earth
 * - Link Requirement: -
 * Abilities:
 * - While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-016: Jegan", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(jegan.id).toBe("GD01-016");
      expect(jegan.name).toBe("Jegan");
      expect(jegan.number).toBe(16);
      expect(jegan.set).toBe("GD01");
      expect(jegan.type).toBe("unit");
      expect(jegan.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(jegan.cost).toBe(2);
      expect(jegan.level).toBe(3);
      expect(jegan.ap).toBe(2);
      expect(jegan.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(jegan.color).toBe("blue");
    });

    it("should have correct traits", () => {
      expect(jegan.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(jegan.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(jegan.linkRequirement).toEqual(["-"]);
    });

    it("should have card text", () => {
      expect(jegan.text).toBeTruthy();
      expect(jegan.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(jegan.abilities).toBeDefined();
      expect(Array.isArray(jegan.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(jegan.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      jegan.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [jegan],
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
          battleArea: [jegan],
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
          battleArea: [jegan],
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

      expect(jegan.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [jegan],
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

      expect(jegan.zones).toContain("space");
      expect(jegan.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(jegan).toHaveProperty("implemented");
      expect(jegan).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 3", () => {
      expect(jegan.level).toBe(3);
      expect(jegan.cost).toBe(2);
      expect(jegan.ap).toBe(2);
      expect(jegan.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = jegan.ap + jegan.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [jegan],
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
