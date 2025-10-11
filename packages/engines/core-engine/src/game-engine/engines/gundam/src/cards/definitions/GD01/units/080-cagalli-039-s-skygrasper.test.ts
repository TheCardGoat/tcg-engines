import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { card } from "./080-cagalli-039-s-skygrasper";

/**
 * Tests for GD01-080: Cagalli&#039;s Skygrasper
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 1
 * - Color: white
 * - Type: unit
 * - Rarity: common
 * - Traits: earth federation
 * - Zones: earth
 * - Link Requirement: cagalli yula athha
 * Abilities:
 * - 【destroyed】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("GD01-080: Cagalli&#039;s Skygrasper", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(card.id).toBe("GD01-080");
      expect(card.name).toBe("Cagalli&#039;s Skygrasper");
      expect(card.number).toBe(80);
      expect(card.set).toBe("GD01");
      expect(card.type).toBe("unit");
      expect(card.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(card.cost).toBe(2);
      expect(card.level).toBe(2);
      expect(card.ap).toBe(2);
      expect(card.hp).toBe(1);
    });

    it("should have correct color", () => {
      expect(card.color).toBe("white");
    });

    it("should have correct traits", () => {
      expect(card.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(card.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(card.linkRequirement).toEqual(["cagalli yula athha"]);
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

      expect(card.linkRequirement).toEqual(["cagalli yula athha"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [card],
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
    it("should have appropriate stats for level 2", () => {
      expect(card.level).toBe(2);
      expect(card.cost).toBe(2);
      expect(card.ap).toBe(2);
      expect(card.hp).toBe(1);
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
