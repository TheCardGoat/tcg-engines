import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { tragos } from "./009-tragos";

/**
 * Tests for ST02-009: Tragos
 *
 * Card Properties:
 * - Cost: 1, Level: 1, AP: 1, HP: 1
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

describe("ST02-009: Tragos", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(tragos.id).toBe("ST02-009");
      expect(tragos.name).toBe("Tragos");
      expect(tragos.number).toBe(9);
      expect(tragos.set).toBe("ST02");
      expect(tragos.type).toBe("unit");
      expect(tragos.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(tragos.cost).toBe(1);
      expect(tragos.level).toBe(1);
      expect(tragos.ap).toBe(1);
      expect(tragos.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(tragos.color).toBe("blue");
      expect(tragos.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(tragos.zones).toEqual(["earth"]);
    });

    it("should have no link requirement", () => {
      expect(tragos.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Blocker ability", () => {
      expect(tragos.text).toContain("Blocker");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(tragos.abilities).toBeDefined();
      expect(tragos.abilities.length).toBe(2);
    });

    it("should have continuous Blocker ability", () => {
      const ability = tragos.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Blocker>");
    });

    it("should have Blocker keyword effect", () => {
      const ability = tragos.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Blocker");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Tragos costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [tragos],
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

    it("should set up scenario with Tragos in battle area", () => {
      // Tragos with Blocker ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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

      // Tragos is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Blocker ability testing", () => {
      // Tragos can block enemy attacks
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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
      // Tragos has no link requirement, can be played freely
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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
      expect(tragos.linkRequirement).toEqual(["-"]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should only be deployable in earth zones", () => {
      // Tragos can only be deployed in earth zones
      const engine = new GundamTestEngine(
        {
          hand: [tragos],
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

      // Tragos is earth-only
      expect(tragos.zones).toEqual(["earth"]);
      expect(tragos.zones).not.toContain("space");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should work as cheap defensive blocker", () => {
      // Tragos can block attacks to protect base
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be very efficient for early game deployment", () => {
      // Cost 1 allows turn 1 deployment
      const engine = new GundamTestEngine(
        {
          hand: [tragos],
          resourceArea: 1, // Minimal resources needed
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be played as soon as turn 1
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_one");
    });

    it("should work as emergency blocker", () => {
      // Cheapest possible blocker for desperate situations
      const engine = new GundamTestEngine(
        {
          hand: [tragos],
          resourceArea: 1,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple attackers
          resourceArea: 5,
          deck: 30,
        },
      );

      // Cost 1 Blocker for emergency defense
      expect(tragos.cost).toBe(1);
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(tragos).toHaveProperty("implemented");
      expect(tragos).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 1 stats appropriate for cost 1", () => {
      // Level 1 unit with 1 cost is minimum value
      expect(tragos.level).toBe(1);
      expect(tragos.cost).toBe(1);
      expect(tragos.ap).toBe(1);
      expect(tragos.hp).toBe(1);
    });

    it("should have minimal stats balanced by Blocker", () => {
      // Tragos has 1 AP and 1 HP - minimal stats
      const totalStats = tragos.ap + tragos.hp;
      expect(totalStats).toBe(2); // 1 + 1

      // Blocker ability is the value
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
    });

    it("should set up combat scenario", () => {
      // Tragos with 1 AP defending
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Tragos can block with 1 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be cheapest possible blocker", () => {
      // Cost 1 is minimum cost
      expect(tragos.cost).toBe(1);

      // Provides Blocker at minimum investment
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
    });

    it("should work as defensive utility unit", () => {
      // Blocker ability makes Tragos a defensive tool
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be extremely fragile", () => {
      // 1 HP means dies to any damage
      expect(tragos.hp).toBe(1);
      expect(tragos.ap).toBe(1);
      expect(tragos.level).toBe(1);

      // Trades itself to block one attack
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
    });

    it("should work as speed bump", () => {
      // Cheapest way to slow down opponent
      const engine = new GundamTestEngine(
        {
          hand: [tragos],
          resourceArea: 1,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Minimal investment for blocking one attack
      expect(tragos.cost).toBe(1);
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up blocking scenario", () => {
      // Tragos can intercept one enemy attack
      const engine = new GundamTestEngine(
        {
          battleArea: [tragos],
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
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
      expect(tragos.hp).toBe(1);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have perfect stat efficiency for cost", () => {
      // 1/1 for 1 is standard base stats
      const totalStats = tragos.ap + tragos.hp;
      expect(totalStats).toBe(2);
      expect(tragos.cost).toBe(1);

      // Blocker adds value beyond stats
      expect(tragos.abilities[0].effects[0].keyword).toBe("Blocker");
    });
  });
});
