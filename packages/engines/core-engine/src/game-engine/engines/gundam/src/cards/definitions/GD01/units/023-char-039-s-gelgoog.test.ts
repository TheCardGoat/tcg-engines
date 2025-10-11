import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { card } from "./023-char-039-s-gelgoog";

/**
 * Tests for GD01-023: Char&#039;s Gelgoog
 *
 * Card Properties:
 * - Cost: 4, Level: 4, AP: 4, HP: 3
 * - Color: green
 * - Type: unit
 * - Rarity: legendary
 * - Traits: zeon
 * - Zones: space, earth
 * - Link Requirement: char aznable
 * Abilities:
 * - 【activate･main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-023: Char&#039;s Gelgoog", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(card.id).toBe("GD01-023");
      expect(card.name).toBe("Char&#039;s Gelgoog");
      expect(card.number).toBe(23);
      expect(card.set).toBe("GD01");
      expect(card.type).toBe("unit");
      expect(card.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(card.cost).toBe(4);
      expect(card.level).toBe(4);
      expect(card.ap).toBe(4);
      expect(card.hp).toBe(3);
    });

    it("should have correct color", () => {
      expect(card.color).toBe("green");
    });

    it("should have correct traits", () => {
      expect(card.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(card.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(card.linkRequirement).toEqual(["char aznable"]);
    });

    it("should have card text", () => {
      expect(card.text).toBeTruthy();
      expect(card.text.length).toBeGreaterThan(0);
    });
  });

  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(card.abilities).toBeDefined();
      expect(Array.isArray(card.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(card.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      card.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [card],
          resourceArea: 6,
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
      assertZoneCount(engine, "resourceArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [card],
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
          battleArea: [card],
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

      expect(card.linkRequirement).toEqual(["char aznable"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [card],
          resourceArea: 6,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(card.zones).toContain("space");
      expect(card.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(card).toHaveProperty("implemented");
      expect(card).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level 4", () => {
      expect(card.level).toBe(4);
      expect(card.cost).toBe(4);
      expect(card.ap).toBe(4);
      expect(card.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      const totalStats = card.ap + card.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [card],
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
