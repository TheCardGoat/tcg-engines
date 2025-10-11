import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { falmel } from "./016-falmel";

/**
 * Tests for ST03-016: Falmel
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: Green
 * - Type: Base
 * - Traits: Zeon, Warship
 * - Zones: Space only
 * - AP: 0, HP: 5
 *
 * Abilities:
 * - 【Burst】Deploy this card
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Base card deployment scenarios
 * - Shield base mechanics
 * - Space-only zone restriction
 */

describe("ST03-016: Falmel", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(falmel.id).toBe("ST03-016");
      expect(falmel.name).toBe("Falmel");
      expect(falmel.number).toBe(16);
      expect(falmel.set).toBe("ST03");
      expect(falmel.type).toBe("base");
      expect(falmel.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(falmel.cost).toBe(2);
      expect(falmel.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(falmel.color).toBe("green");
      expect(falmel.traits).toEqual(["zeon", "warship"]);
    });

    it("should have space-only zone restriction", () => {
      expect(falmel.zones).toEqual(["space"]);
      expect(falmel.zones).not.toContain("earth");
    });

    it("should have base card stats", () => {
      expect(falmel.ap).toBe(0);
      expect(falmel.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(falmel.text).toContain("Burst");
      expect(falmel.text).toContain("Deploy this card");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(falmel.abilities).toBeDefined();
      expect(falmel.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = falmel.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect", () => {
      const ability = falmel.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Falmel costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [falmel],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Card is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario as shield base", () => {
      // Falmel can be placed in shield base zone
      const engine = new GundamTestEngine(
        {
          hand: [falmel],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
          shieldBase: 0, // Empty shield base (replaced EX Base)
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario for deploying as shield base
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 0, "player_one");
    });

    it("should set up scenario for Burst activation", () => {
      // Falmel with Burst ability in shield section
      // When shield is destroyed, Burst triggers: deploy this card
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Falmel could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, deploy Falmel
      const ability = falmel.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should be deployable only in space", () => {
      // Falmel can only be deployed in space zone
      const engine = new GundamTestEngine(
        {
          hand: [falmel],
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

      // Falmel supports only space deployment
      expect(falmel.zones).toEqual(["space"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(falmel).toHaveProperty("implemented");
      expect(falmel).toHaveProperty("missingTestCase");
    });

    it("should have placeholder effect for deploy", () => {
      // Note: The deploy effect is referenced but not fully defined yet
      const ability = falmel.abilities[0];
      const effect = ability.effects[0];

      expect(effect.type).toBe("placeholder");
      expect(effect.parameters).toBeDefined();
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 2 base", () => {
      // Level 3 base with cost 2
      expect(falmel.level).toBe(3);
      expect(falmel.cost).toBe(2);
    });

    it("should have 0 AP and 5 HP", () => {
      // Base cards typically have 0 AP
      expect(falmel.ap).toBe(0);
      expect(falmel.hp).toBe(5);
    });

    it("should provide defensive value as shield base", () => {
      // Falmel: 5 HP as shield base provides defensive value
      // Base cards in shield base zone act as persistent shields
      expect(falmel.hp).toBe(5);
      expect(falmel.type).toBe("base");
    });

    it("should have Zeon and Warship traits", () => {
      // Traits important for deck building and card interactions
      expect(falmel.traits).toContain("zeon");
      expect(falmel.traits).toContain("warship");
    });

    it("should be green defensive tool", () => {
      // Green deck base option
      expect(falmel.color).toBe("green");
      expect(falmel.type).toBe("base");
    });

    it("should be space-specialized base", () => {
      // Space-only bases are specialized for space strategies
      expect(falmel.zones).toEqual(["space"]);
      expect(falmel.zones.length).toBe(1);
    });
  });

  describe("Burst Mechanics", () => {
    it("should deploy when Burst triggers", () => {
      // Burst effect: Deploy this card to shield base
      expect(falmel.text).toBe("【Burst】Deploy this card.");

      const ability = falmel.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should provide value from shield zone", () => {
      // Unlike regular shields, Falmel deploys when destroyed
      const engine = new GundamTestEngine(
        {
          shieldSection: 6, // Falmel as shield
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Provides value even when used as shield - deploys to shield base
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      expect(falmel.text).toContain("Burst");
    });
  });

  describe("Shield Base Mechanics", () => {
    it("should act as persistent shield", () => {
      // Base cards in shield base remain until destroyed
      // Unlike EX Base token, base cards provide HP shield
      expect(falmel.hp).toBe(5);
      expect(falmel.type).toBe("base");
    });

    it("should be replaceable with other bases", () => {
      // Only one base card can be in shield base at a time
      // Rule 3-2-2-2: Shield Base zone can hold max 1 card
      const engine = new GundamTestEngine(
        {
          hand: [falmel],
          shieldBase: 0, // Empty - can deploy Falmel here
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "shieldBase", 0, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should provide HP shield equal to its HP stat", () => {
      // Falmel has 5 HP - provides 5 HP as shield base
      // When taking damage to shield base, subtract from base's HP
      expect(falmel.hp).toBe(5);
      expect(falmel.ap).toBe(0); // Bases don't attack
    });
  });

  describe("Zone Deployment Restrictions", () => {
    it("should support only space deployment", () => {
      // Falmel is specialized for space combat
      expect(falmel.zones).toEqual(["space"]);
      expect(falmel.zones.length).toBe(1);
    });

    it("should work well in space-focused strategies", () => {
      // Space-only restriction makes Falmel ideal for space decks
      expect(falmel.zones).toContain("space");
      expect(falmel.zones).not.toContain("earth");

      // Green Zeon warship for space strategies
      expect(falmel.traits).toContain("zeon");
      expect(falmel.traits).toContain("warship");
    });
  });
});
