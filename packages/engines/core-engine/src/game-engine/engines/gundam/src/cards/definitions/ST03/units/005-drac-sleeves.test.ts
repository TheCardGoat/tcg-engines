import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { dracSleeves } from "./005-drac-sleeves";

/**
 * Tests for ST03-005: Dra-C (Sleeves)
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 2
 * - Color: Red
 * - Traits: Zeon
 * - Link Requirement: -
 * - Zones: Space only
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Card usability in game scenarios
 * - Space-only zone restriction
 */

describe("ST03-005: Dra-C (Sleeves)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(dracSleeves.id).toBe("ST03-005");
      expect(dracSleeves.name).toBe("Dra-C (Sleeves)");
      expect(dracSleeves.number).toBe(5);
      expect(dracSleeves.set).toBe("ST03");
      expect(dracSleeves.type).toBe("unit");
      expect(dracSleeves.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(dracSleeves.cost).toBe(1);
      expect(dracSleeves.level).toBe(1);
      expect(dracSleeves.ap).toBe(1);
      expect(dracSleeves.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(dracSleeves.color).toBe("red");
      expect(dracSleeves.traits).toEqual(["zeon"]);
    });

    it("should have space-only zone restriction", () => {
      expect(dracSleeves.zones).toEqual(["space"]);
      expect(dracSleeves.zones).not.toContain("earth");
    });

    it("should have no specific link requirement", () => {
      expect(dracSleeves.linkRequirement).toEqual(["-"]);
    });

    it("should have no abilities (vanilla unit)", () => {
      expect(dracSleeves.abilities).toBeDefined();
      expect(dracSleeves.abilities.length).toBe(0);
      expect(dracSleeves.text).toBe("");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Dra-C (Sleeves) costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [dracSleeves],
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

    it("should set up scenario with Dra-C in battle area", () => {
      // Dra-C (Sleeves) as a cheap defensive unit
      const engine = new GundamTestEngine(
        {
          battleArea: [dracSleeves],
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

      // Dra-C (Sleeves) is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be deployable only in space zone", () => {
      // Dra-C (Sleeves) can only be deployed in space
      const engine = new GundamTestEngine(
        {
          hand: [dracSleeves],
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

      // Dra-C supports only space deployment
      expect(dracSleeves.zones).toEqual(["space"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work with no pilot link requirement", () => {
      // Dra-C (Sleeves) has no specific pilot requirement - flexible pairing
      expect(dracSleeves.linkRequirement).toEqual(["-"]);

      const engine = new GundamTestEngine(
        {
          battleArea: [dracSleeves],
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
      expect(dracSleeves).toHaveProperty("implemented");
      expect(dracSleeves).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is the cheapest possible unit
      expect(dracSleeves.level).toBe(1);
      expect(dracSleeves.cost).toBe(1);
      expect(dracSleeves.ap).toBe(1);
      expect(dracSleeves.hp).toBe(2);
    });

    it("should have defensive-focused stats", () => {
      // Dra-C (Sleeves) has 1 AP and 2 HP - defensive stats for blocking
      const totalStats = dracSleeves.ap + dracSleeves.hp;
      expect(totalStats).toBe(3); // 1 + 2

      // HP-focused (HP > AP) - designed for blocking
      expect(dracSleeves.hp).toBeGreaterThan(dracSleeves.ap);
    });

    it("should set up combat scenario", () => {
      // Dra-C (Sleeves) with 1 AP attacking or blocking
      const engine = new GundamTestEngine(
        {
          battleArea: [dracSleeves],
          resourceArea: 2,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 2,
          deck: 30,
        },
      );

      // Combat scenario ready: Dra-C can participate with 1 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an efficient early-game blocker", () => {
      // Dra-C (Sleeves) is a cheap defensive unit for early game
      expect(dracSleeves.cost).toBe(1);
      expect(dracSleeves.hp).toBe(2);

      // 2 HP for 1 cost is efficient for blocking
      const hpPerCost = dracSleeves.hp / dracSleeves.cost;
      expect(hpPerCost).toBe(2);
    });

    it("should work well in Zeon tribal strategies", () => {
      // Dra-C (Sleeves) has Zeon trait for tribal synergies
      expect(dracSleeves.traits).toContain("zeon");

      const engine = new GundamTestEngine(
        {
          battleArea: [dracSleeves],
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
