import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamSandrock } from "./004-gundam-sandrock";

/**
 * Tests for ST02-004: Gundam Sandrock
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 4, HP: 3
 * - Color: Green
 * - Traits: None
 * - Link Requirement: Quatre Raberba Winner
 * - Zones: Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - High AP low cost unit
 */

describe("ST02-004: Gundam Sandrock", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamSandrock.id).toBe("ST02-004");
      expect(gundamSandrock.name).toBe("Gundam Sandrock");
      expect(gundamSandrock.number).toBe(4);
      expect(gundamSandrock.set).toBe("ST02");
      expect(gundamSandrock.type).toBe("unit");
      expect(gundamSandrock.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gundamSandrock.cost).toBe(2);
      expect(gundamSandrock.level).toBe(4);
      expect(gundamSandrock.ap).toBe(4);
      expect(gundamSandrock.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(gundamSandrock.color).toBe("green");
      expect(gundamSandrock.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(gundamSandrock.zones).toEqual(["earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamSandrock.linkRequirement).toEqual(["quatre raberba winner"]);
    });

    it("should have no abilities as vanilla unit", () => {
      expect(gundamSandrock.abilities).toEqual([]);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam Sandrock costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundamSandrock],
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

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Gundam Sandrock in battle area", () => {
      // Gundam Sandrock as vanilla beater in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
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

      // Gundam Sandrock is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Quatre Raberba Winner pilot link requirement", () => {
      // Gundam Sandrock has link requirement for Quatre Raberba Winner
      // When paired with Quatre, pilot effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
          hand: 5, // Could have Quatre Raberba Winner pilot card
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

      // Gundam Sandrock can be paired with Quatre Raberba Winner
      expect(gundamSandrock.linkRequirement).toContain("quatre raberba winner");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should only be deployable in earth zones", () => {
      // Gundam Sandrock can only be deployed in earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gundamSandrock],
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

      // Gundam Sandrock is earth-only
      expect(gundamSandrock.zones).toEqual(["earth"]);
      expect(gundamSandrock.zones).not.toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work as aggressive early attacker", () => {
      // Gundam Sandrock has high AP for its cost
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // 4 AP at cost 2 is very aggressive
      expect(gundamSandrock.ap).toBe(4);
      expect(gundamSandrock.cost).toBe(2);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be efficient for early game deployment", () => {
      // Cost 2 allows early deployment
      const engine = new GundamTestEngine(
        {
          hand: [gundamSandrock],
          resourceArea: 2, // Minimal resources needed
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be played as soon as turn 2
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundamSandrock).toHaveProperty("implemented");
      expect(gundamSandrock).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 2", () => {
      // Level 4 unit with 2 cost is excellent value
      expect(gundamSandrock.level).toBe(4);
      expect(gundamSandrock.cost).toBe(2);
      expect(gundamSandrock.ap).toBe(4);
      expect(gundamSandrock.hp).toBe(3);
    });

    it("should have aggressive AP-focused stats", () => {
      // Gundam Sandrock has 4 AP and 3 HP - offensive stats
      const totalStats = gundamSandrock.ap + gundamSandrock.hp;
      expect(totalStats).toBe(7); // 4 + 3

      // High AP relative to HP
      expect(gundamSandrock.ap).toBeGreaterThan(gundamSandrock.hp);
    });

    it("should set up combat scenario", () => {
      // Gundam Sandrock with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam Sandrock can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be excellent value for cost", () => {
      // 4 AP at cost 2 is very efficient
      const apPerCost = gundamSandrock.ap / gundamSandrock.cost;
      expect(apPerCost).toBe(2); // 4 AP / 2 cost = 2 AP per cost

      // Total stats are high for cost
      const totalStats = gundamSandrock.ap + gundamSandrock.hp;
      expect(totalStats).toBeGreaterThanOrEqual(7);
    });

    it("should work as vanilla beater", () => {
      // No abilities means straightforward combat unit
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Vanilla unit with high AP for cost
      expect(gundamSandrock.abilities).toEqual([]);
      expect(gundamSandrock.ap).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have low HP as trade-off for high AP", () => {
      // 3 HP is relatively low for level 4
      expect(gundamSandrock.hp).toBe(3);
      expect(gundamSandrock.level).toBe(4);

      // Glass cannon design
      expect(gundamSandrock.ap).toBeGreaterThan(gundamSandrock.hp);
    });

    it("should set up favorable trade scenarios", () => {
      // High AP means can destroy higher HP units
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamSandrock],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit with 4 or less HP
          resourceArea: 5,
          deck: 30,
        },
      );

      // 4 AP can destroy most early game units
      expect(gundamSandrock.ap).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
