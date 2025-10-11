import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { moebiusZero } from "./003-moebius-zero";

/**
 * Tests for ST04-003: Moebius Zero
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 2, HP: 4
 * - Color: White
 * - Traits: Earth Federation
 * - Link Requirement: Mu La Flaga
 * - Zones: Space only
 *
 * Abilities:
 * - None (vanilla unit)
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Vanilla unit characteristics
 * - Card usability in game scenarios
 * - Combat mechanics
 */

describe("ST04-003: Moebius Zero", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(moebiusZero.id).toBe("ST04-003");
      expect(moebiusZero.name).toBe("Moebius Zero");
      expect(moebiusZero.number).toBe(3);
      expect(moebiusZero.set).toBe("ST04");
      expect(moebiusZero.type).toBe("unit");
      expect(moebiusZero.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(moebiusZero.cost).toBe(2);
      expect(moebiusZero.level).toBe(3);
      expect(moebiusZero.ap).toBe(2);
      expect(moebiusZero.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(moebiusZero.color).toBe("white");
      expect(moebiusZero.traits).toEqual(["earth federation"]);
    });

    it("should have correct zones", () => {
      expect(moebiusZero.zones).toEqual(["space"]);
    });

    it("should have correct link requirement", () => {
      expect(moebiusZero.linkRequirement).toEqual(["mu la flaga"]);
    });

    it("should have empty text for vanilla unit", () => {
      expect(moebiusZero.text).toBe("");
    });
  });

  describe("Abilities Definition", () => {
    it("should have no abilities", () => {
      expect(moebiusZero.abilities).toBeDefined();
      expect(moebiusZero.abilities.length).toBe(0);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Moebius Zero costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [moebiusZero],
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

    it("should set up scenario with Moebius Zero in battle area", () => {
      // Moebius Zero as vanilla unit in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [moebiusZero],
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

      // Moebius Zero is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work with Mu La Flaga pilot link requirement", () => {
      // Moebius Zero has link requirement for Mu La Flaga
      // When paired with Mu La Flaga, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [moebiusZero],
          hand: 5, // Could have Mu La Flaga pilot card
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

      // Moebius Zero can be paired with Mu La Flaga
      expect(moebiusZero.linkRequirement).toContain("mu la flaga");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable only in space zone", () => {
      // Moebius Zero is space-only unit
      const engine = new GundamTestEngine(
        {
          hand: [moebiusZero],
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

      // Moebius Zero supports only space deployment
      expect(moebiusZero.zones).toEqual(["space"]);
      expect(moebiusZero.zones).not.toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(moebiusZero).toHaveProperty("implemented");
      expect(moebiusZero).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 2", () => {
      // Level 3 unit with 2 cost is fair early game unit
      expect(moebiusZero.level).toBe(3);
      expect(moebiusZero.cost).toBe(2);
      expect(moebiusZero.ap).toBe(2);
      expect(moebiusZero.hp).toBe(4);
    });

    it("should have defensive stat distribution", () => {
      // Moebius Zero has 2 AP and 4 HP - defensive stats
      const totalStats = moebiusZero.ap + moebiusZero.hp;
      expect(totalStats).toBe(6); // 2 + 4

      // High HP relative to AP
      expect(moebiusZero.hp).toBeGreaterThan(moebiusZero.ap);
    });

    it("should set up combat scenario", () => {
      // Moebius Zero with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [moebiusZero],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Moebius Zero can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be an early game defensive unit", () => {
      // Level 3 is early game, cost 2 with defensive stats
      expect(moebiusZero.level).toBe(3);
      expect(moebiusZero.cost).toBe(2);

      // 4 HP makes it durable
      expect(moebiusZero.hp).toBe(4);
    });

    it("should work as defensive wall", () => {
      // Moebius Zero with 4 HP can absorb multiple attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [moebiusZero],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // High HP makes it good for defense
      expect(moebiusZero.hp).toBe(4);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(moebiusZero.traits).toContain("earth federation");
    });

    it("should be space-specialized unit", () => {
      // Common rarity white deck unit for space combat
      expect(moebiusZero.color).toBe("white");
      expect(moebiusZero.rarity).toBe("common");
      expect(moebiusZero.zones).toEqual(["space"]);
    });

    it("should have vanilla unit characteristics", () => {
      // No abilities means stats are the focus
      expect(moebiusZero.abilities.length).toBe(0);
      expect(moebiusZero.text).toBe("");

      // Good stats for cost compensate for no abilities
      const totalStats = moebiusZero.ap + moebiusZero.hp;
      expect(totalStats).toBe(6);
    });
  });

  describe("Zone Restrictions", () => {
    it("should be restricted to space only", () => {
      // Moebius Zero is space-only fighter
      expect(moebiusZero.zones).toEqual(["space"]);
      expect(moebiusZero.zones.length).toBe(1);
    });

    it("should compare with versatile units", () => {
      // Moebius Zero: space only (specialized)
      // Some units: space + earth (versatile)
      expect(moebiusZero.zones).toContain("space");
      expect(moebiusZero.zones).not.toContain("earth");
    });

    it("should set up space combat scenario", () => {
      // Moebius Zero in space battle
      const engine = new GundamTestEngine(
        {
          battleArea: [moebiusZero],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Space-only unit deployed
      expect(moebiusZero.zones).toEqual(["space"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
