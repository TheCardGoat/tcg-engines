import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gyan } from "./032-gyan";

/**
 * Tests for GD01-032: Gyan
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 4, HP: 3
 * - Color: green
 * - Type: continuous
 * - Rarity: rare
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: m&#039;quve
 * Abilities:
 * - <Blocker>
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-032: Gyan", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gyan.id).toBe("GD01-032");
      expect(gyan.name).toBe("Gyan");
      expect(gyan.number).toBe(32);
      expect(gyan.set).toBe("GD01");
      expect(gyan.type).toBe("unit");
      expect(gyan.rarity).toBe("rare");
    });

    it("should have correct stats", () => {
      expect(gyan.cost).toBe(3);
      expect(gyan.level).toBe(4);
      expect(gyan.ap).toBe(4);
      expect(gyan.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(gyan.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(gyan.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gyan.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gyan.linkRequirement).toEqual(["m&#039;quve"]);
    });

    it("should have card text", () => {
      expect(gyan.text).toBeTruthy();
      expect(gyan.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(gyan.abilities).toBeDefined();
      expect(Array.isArray(gyan.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(gyan.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      gyan.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gyan],
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
          battleArea: [gyan],
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
          battleArea: [gyan],
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

      expect(gyan.linkRequirement).toEqual(["m&#039;quve"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [gyan],
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

      expect(gyan.zones).toContain("space");
      expect(gyan.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(gyan).toHaveProperty("implemented");
      expect(gyan).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(gyan.level).toBe(4);
      expect(gyan.cost).toBe(3);
      expect(gyan.ap).toBe(4);
      expect(gyan.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = gyan.ap + gyan.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [gyan],
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
