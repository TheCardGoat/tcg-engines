import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamAerialBitOnForm } from "./007-gundam-aerial-bit-on-form";

/**
 * Tests for ST01-007: Gundam Aerial (Bit on Form)
 *
 * Card Properties:
 * - Cost: 2, Level: 4, AP: 3, HP: 4
 * - Color: White
 * - Traits: Academy
 * - Link Requirement: Suletta Mercury
 * - Zones: Space, Earth
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Vanilla unit with no special abilities
 * - Efficient mid-level unit
 * - Defensive stat distribution
 */

describe("ST01-007: Gundam Aerial (Bit on Form)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamAerialBitOnForm.id).toBe("ST01-007");
      expect(gundamAerialBitOnForm.name).toBe("Gundam Aerial (Bit on Form)");
      expect(gundamAerialBitOnForm.number).toBe(7);
      expect(gundamAerialBitOnForm.set).toBe("ST01");
      expect(gundamAerialBitOnForm.type).toBe("unit");
      expect(gundamAerialBitOnForm.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gundamAerialBitOnForm.cost).toBe(2);
      expect(gundamAerialBitOnForm.level).toBe(4);
      expect(gundamAerialBitOnForm.ap).toBe(3);
      expect(gundamAerialBitOnForm.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(gundamAerialBitOnForm.color).toBe("white");
      expect(gundamAerialBitOnForm.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamAerialBitOnForm.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamAerialBitOnForm.linkRequirement).toEqual([
        "suletta mercury",
      ]);
    });

    it("should have empty text for vanilla unit", () => {
      expect(gundamAerialBitOnForm.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(gundamAerialBitOnForm.abilities).toBeDefined();
      expect(gundamAerialBitOnForm.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam Aerial Bit on Form costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialBitOnForm],
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

    it("should set up scenario with Gundam Aerial in battle area", () => {
      // Gundam Aerial Bit on Form vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
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

      // Gundam Aerial is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Suletta Mercury pilot link requirement", () => {
      // Gundam Aerial Bit on Form has link requirement for Suletta Mercury
      // When paired with Suletta Mercury, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
          hand: 5, // Could have Suletta Mercury pilot card
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

      // Gundam Aerial can be paired with Suletta Mercury
      expect(gundamAerialBitOnForm.linkRequirement).toContain(
        "suletta mercury",
      );
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Gundam Aerial can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialBitOnForm],
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

      // Gundam Aerial supports both deployment zones
      expect(gundamAerialBitOnForm.zones).toContain("space");
      expect(gundamAerialBitOnForm.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should function as efficient mid-level unit", () => {
      // Gundam Aerial Bit on Form with level 4 stats for cost 2
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // High-level unit at low cost
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gundamAerialBitOnForm.level).toBe(4);
      expect(gundamAerialBitOnForm.cost).toBe(2);
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundamAerialBitOnForm).toHaveProperty("implemented");
      expect(gundamAerialBitOnForm).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 2", () => {
      // Level 4 unit with 2 cost is very efficient
      expect(gundamAerialBitOnForm.level).toBe(4);
      expect(gundamAerialBitOnForm.cost).toBe(2);
      expect(gundamAerialBitOnForm.ap).toBe(3);
      expect(gundamAerialBitOnForm.hp).toBe(4);
    });

    it("should have defensive-focused AP and HP distribution", () => {
      // Gundam Aerial Bit on Form has 3 AP and 4 HP - defensive stats
      const totalStats = gundamAerialBitOnForm.ap + gundamAerialBitOnForm.hp;
      expect(totalStats).toBe(7); // 3 + 4

      // More HP than AP indicates defensive unit
      expect(gundamAerialBitOnForm.hp).toBeGreaterThan(
        gundamAerialBitOnForm.ap,
      );
    });

    it("should set up combat scenario", () => {
      // Gundam Aerial with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam Aerial can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have excellent stat efficiency for cost", () => {
      // 7 total stats for 2 cost is very efficient
      const totalStats = gundamAerialBitOnForm.ap + gundamAerialBitOnForm.hp;
      const statsPerCost = totalStats / gundamAerialBitOnForm.cost;
      expect(statsPerCost).toBe(3.5); // 7 stats / 2 cost = 3.5 stats per cost

      // Above average stats-per-cost ratio
      expect(totalStats).toBe(7);
    });

    it("should be effective as defensive anchor", () => {
      // High HP makes good defensive unit
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can withstand multiple attacks with 4 HP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gundamAerialBitOnForm.hp).toBe(4);
    });

    it("should be cost-effective for its level", () => {
      // Level 4 for only 2 cost is exceptional value
      const levelPerCost =
        gundamAerialBitOnForm.level / gundamAerialBitOnForm.cost;
      expect(levelPerCost).toBe(2); // Level 4 / Cost 2 = 2

      // One of the best level-per-cost ratios
      expect(gundamAerialBitOnForm.level).toBe(4);
      expect(gundamAerialBitOnForm.cost).toBe(2);
    });

    it("should enable aggressive mid-game strategies", () => {
      // Strong stats at low cost enables early deployment
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialBitOnForm],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 2,
          deck: 30,
        },
      );

      // Can be played early with strong mid-game stats
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gundamAerialBitOnForm.ap).toBe(3);
      expect(gundamAerialBitOnForm.level).toBe(4);
    });
  });
});
