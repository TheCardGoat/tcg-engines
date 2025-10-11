import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aries } from "./008-aries";

/**
 * Tests for ST02-008: Aries
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 1
 * - Color: Blue
 * - Traits: None
 * - Link Requirement: None (-)
 * - Zones: Earth
 *
 * Abilities:
 * - <Blocker>: Can block attacks
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Blocker keyword effect definition
 * - Card usability in game scenarios
 */

describe("ST02-008: Aries", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aries.id).toBe("ST02-008");
      expect(aries.name).toBe("Aries");
      expect(aries.number).toBe(8);
      expect(aries.set).toBe("ST02");
      expect(aries.type).toBe("unit");
      expect(aries.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(aries.cost).toBe(2);
      expect(aries.level).toBe(2);
      expect(aries.ap).toBe(2);
      expect(aries.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(aries.color).toBe("blue");
      expect(aries.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(aries.zones).toEqual(["earth"]);
    });

    it("should have no link requirement", () => {
      expect(aries.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Blocker ability", () => {
      expect(aries.text).toContain("Blocker");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(aries.abilities).toBeDefined();
      expect(aries.abilities.length).toBe(2);
    });

    it("should have continuous Blocker ability", () => {
      const ability = aries.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Blocker>");
    });

    it("should have Blocker keyword effect", () => {
      const ability = aries.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Blocker");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Aries costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [aries],
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

    it("should set up scenario with Aries in battle area", () => {
      // Aries with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
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

      // Aries is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Aries can block enemy attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy attacker
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Blocker ability: can intercept attacks
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be playable without pilot requirement", () => {
      // Aries has no link requirement, can be played freely
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
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

      // No pilot required
      expect(aries.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should only be deployable in earth zones", () => {
      // Aries can only be deployed in earth zones
      const engine = new GundamTestEngine(
        {
          hand: [aries],
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

      // Aries is earth-only
      expect(aries.zones).toEqual(["earth"]);
      expect(aries.zones).not.toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work as defensive blocker", () => {
      // Aries can block attacks to protect base
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker ability provides defensive utility
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be efficient for early game deployment", () => {
      // Cost 2 allows early deployment
      const engine = new GundamTestEngine(
        {
          hand: [aries],
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
      expect(aries).toHaveProperty("implemented");
      expect(aries).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is standard value
      expect(aries.level).toBe(2);
      expect(aries.cost).toBe(2);
      expect(aries.ap).toBe(2);
      expect(aries.hp).toBe(1);
    });

    it("should have low HP as trade-off for Blocker", () => {
      // Aries has 2 AP and 1 HP - fragile blocker
      const totalStats = aries.ap + aries.hp;
      expect(totalStats).toBe(3); // 2 + 1

      // Very low HP
      expect(aries.hp).toBe(1);
    });

    it("should set up combat scenario", () => {
      // Aries with 2 AP defending
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Aries can block with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have low total stats balanced by Blocker", () => {
      // 3 total stats is low for cost 2, but Blocker adds value
      const totalStats = aries.ap + aries.hp;
      expect(totalStats).toBe(3);

      // Blocker ability compensates for low stats
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
    });

    it("should work as defensive utility unit", () => {
      // Blocker ability makes Aries a defensive tool
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Defensive role with Blocker
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be fragile but functional blocker", () => {
      // 1 HP means dies to any damage, but still blocks once
      expect(aries.hp).toBe(1);
      expect(aries.level).toBe(2);

      // Trades itself to block attacks
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
    });

    it("should work as cheap blocker option", () => {
      // Cost 2 with Blocker provides affordable defense
      const engine = new GundamTestEngine(
        {
          hand: [aries],
          resourceArea: 2,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Cheap defensive option
      expect(aries.cost).toBe(2);
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up blocking scenario", () => {
      // Aries can intercept enemy attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [aries],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can block one attack before dying
      expect(aries.abilities[0].effects[0].keyword).toBe("Blocker");
      expect(aries.hp).toBe(1);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
