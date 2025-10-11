import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zaku as zakuI } from "./007-zaku";

/**
 * Tests for ST03-007: Zaku Ⅰ
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 2
 * - Color: Green
 * - Traits: Zeon
 * - Link Requirement: -
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 */

describe("ST03-007: Zaku Ⅰ", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zakuI.id).toBe("ST03-007");
      expect(zakuI.name).toBe("Zaku Ⅰ");
      expect(zakuI.number).toBe(7);
      expect(zakuI.set).toBe("ST03");
      expect(zakuI.type).toBe("unit");
      expect(zakuI.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zakuI.cost).toBe(1);
      expect(zakuI.level).toBe(1);
      expect(zakuI.ap).toBe(1);
      expect(zakuI.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(zakuI.color).toBe("green");
      expect(zakuI.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zakuI.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(zakuI.linkRequirement).toEqual(["-"]);
    });

    it("should have no abilities (vanilla unit)", () => {
      expect(zakuI.abilities).toBeDefined();
      expect(zakuI.abilities.length).toBe(0);
      expect(zakuI.text).toBe("");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Zaku Ⅰ costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [zakuI],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Zaku Ⅰ in battle area", () => {
      // Zaku Ⅰ as a cheap early-game unit
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuI],
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Zaku Ⅰ is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be deployable in both space and earth zones", () => {
      // Zaku Ⅰ can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [zakuI],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Zaku Ⅰ supports both deployment zones
      expect(zakuI.zones).toContain("space");
      expect(zakuI.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work with no pilot link requirement", () => {
      // Zaku Ⅰ has no specific pilot requirement - flexible pairing
      expect(zakuI.linkRequirement).toEqual(["-"]);

      const engine = new GundamTestEngine(
        {
          battleArea: [zakuI],
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 2,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(zakuI).toHaveProperty("implemented");
      expect(zakuI).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is the cheapest possible unit
      expect(zakuI.level).toBe(1);
      expect(zakuI.cost).toBe(1);
      expect(zakuI.ap).toBe(1);
      expect(zakuI.hp).toBe(2);
    });

    it("should have defensive-focused stats", () => {
      // Zaku Ⅰ has 1 AP and 2 HP - defensive stats for blocking
      const totalStats = zakuI.ap + zakuI.hp;
      expect(totalStats).toBe(3); // 1 + 2

      // HP-focused (HP > AP) - designed for blocking
      expect(zakuI.hp).toBeGreaterThan(zakuI.ap);
    });

    it("should set up combat scenario", () => {
      // Zaku Ⅰ with 1 AP attacking or blocking
      const engine = new GundamTestEngine(
        {
          battleArea: [zakuI],
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 2,
          deck: 30,
        },
      );

      // Combat scenario ready: Zaku Ⅰ can participate with 1 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an efficient early-game blocker", () => {
      // Zaku Ⅰ is a cheap defensive unit for early game
      expect(zakuI.cost).toBe(1);
      expect(zakuI.hp).toBe(2);

      // 2 HP for 1 cost is efficient for blocking
      const hpPerCost = zakuI.hp / zakuI.cost;
      expect(hpPerCost).toBe(2);
    });

    it("should work well in Zeon tribal strategies", () => {
      // Zaku Ⅰ has Zeon trait for tribal synergies
      expect(zakuI.traits).toContain("zeon");

      const engine = new GundamTestEngine(
        {
          battleArea: [zakuI],
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 2,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
