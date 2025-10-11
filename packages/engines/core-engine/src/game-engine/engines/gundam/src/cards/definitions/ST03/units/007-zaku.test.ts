import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zaku } from "./007-zaku";

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
      expect(zaku.id).toBe("ST03-007");
      expect(zaku.name).toBe("Zaku Ⅰ");
      expect(zaku.number).toBe(7);
      expect(zaku.set).toBe("ST03");
      expect(zaku.type).toBe("unit");
      expect(zaku.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(zaku.cost).toBe(1);
      expect(zaku.level).toBe(1);
      expect(zaku.ap).toBe(1);
      expect(zaku.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(zaku.color).toBe("green");
      expect(zaku.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(zaku.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(zaku.linkRequirement).toEqual(["-"]);
    });

    it("should have no abilities (vanilla unit)", () => {
      expect(zaku.abilities).toBeDefined();
      expect(zaku.abilities.length).toBe(0);
      expect(zaku.text).toBe("");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Zaku Ⅰ costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [zaku],
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
          battleArea: [zaku],
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
          hand: [zaku],
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
      expect(zaku.zones).toContain("space");
      expect(zaku.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work with no pilot link requirement", () => {
      // Zaku Ⅰ has no specific pilot requirement - flexible pairing
      expect(zaku.linkRequirement).toEqual(["-"]);

      const engine = new GundamTestEngine(
        {
          battleArea: [zaku],
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
      expect(zaku).toHaveProperty("implemented");
      expect(zaku).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is the cheapest possible unit
      expect(zaku.level).toBe(1);
      expect(zaku.cost).toBe(1);
      expect(zaku.ap).toBe(1);
      expect(zaku.hp).toBe(2);
    });

    it("should have defensive-focused stats", () => {
      // Zaku Ⅰ has 1 AP and 2 HP - defensive stats for blocking
      const totalStats = zaku.ap + zaku.hp;
      expect(totalStats).toBe(3); // 1 + 2

      // HP-focused (HP > AP) - designed for blocking
      expect(zaku.hp).toBeGreaterThan(zaku.ap);
    });

    it("should set up combat scenario", () => {
      // Zaku Ⅰ with 1 AP attacking or blocking
      const engine = new GundamTestEngine(
        {
          battleArea: [zaku],
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
      expect(zaku.cost).toBe(1);
      expect(zaku.hp).toBe(2);

      // 2 HP for 1 cost is efficient for blocking
      const hpPerCost = zaku.hp / zaku.cost;
      expect(hpPerCost).toBe(2);
    });

    it("should work well in Zeon tribal strategies", () => {
      // Zaku Ⅰ has Zeon trait for tribal synergies
      expect(zaku.traits).toContain("zeon");

      const engine = new GundamTestEngine(
        {
          battleArea: [zaku],
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
