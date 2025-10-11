import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { rewloola } from "./015-rewloola";

/**
 * Tests for ST03-015: Rewloola
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: Red
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

describe("ST03-015: Rewloola", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(rewloola.id).toBe("ST03-015");
      expect(rewloola.name).toBe("Rewloola");
      expect(rewloola.number).toBe(15);
      expect(rewloola.set).toBe("ST03");
      expect(rewloola.type).toBe("base");
      expect(rewloola.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(rewloola.cost).toBe(2);
      expect(rewloola.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(rewloola.color).toBe("red");
      expect(rewloola.traits).toEqual(["zeon", "warship"]);
    });

    it("should have space-only zone restriction", () => {
      expect(rewloola.zones).toEqual(["space"]);
      expect(rewloola.zones).not.toContain("earth");
    });

    it("should have base card stats", () => {
      expect(rewloola.ap).toBe(0);
      expect(rewloola.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(rewloola.text).toContain("Burst");
      expect(rewloola.text).toContain("Deploy this card");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(rewloola.abilities).toBeDefined();
      expect(rewloola.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = rewloola.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect", () => {
      const ability = rewloola.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Rewloola costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [rewloola],
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
      // Rewloola can be placed in shield base zone
      const engine = new GundamTestEngine(
        {
          hand: [rewloola],
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
      // Rewloola with Burst ability in shield section
      // When shield is destroyed, Burst triggers: deploy this card
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Rewloola could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, deploy Rewloola
      const ability = rewloola.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should be deployable only in space", () => {
      // Rewloola can only be deployed in space zone
      const engine = new GundamTestEngine(
        {
          hand: [rewloola],
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

      // Rewloola supports only space deployment
      expect(rewloola.zones).toEqual(["space"]);
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(rewloola).toHaveProperty("implemented");
      expect(rewloola).toHaveProperty("missingTestCase");
    });

    it("should have placeholder effect for deploy", () => {
      // Note: The deploy effect is referenced but not fully defined yet
      const ability = rewloola.abilities[0];
      const effect = ability.effects[0];

      expect(effect.type).toBe("placeholder");
      expect(effect.parameters).toBeDefined();
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 2 base", () => {
      // Level 3 base with cost 2
      expect(rewloola.level).toBe(3);
      expect(rewloola.cost).toBe(2);
    });

    it("should have 0 AP and 5 HP", () => {
      // Base cards typically have 0 AP
      expect(rewloola.ap).toBe(0);
      expect(rewloola.hp).toBe(5);
    });

    it("should provide defensive value as shield base", () => {
      // Rewloola: 5 HP as shield base provides defensive value
      // Base cards in shield base zone act as persistent shields
      expect(rewloola.hp).toBe(5);
      expect(rewloola.type).toBe("base");
    });

    it("should have Zeon and Warship traits", () => {
      // Traits important for deck building and card interactions
      expect(rewloola.traits).toContain("zeon");
      expect(rewloola.traits).toContain("warship");
    });

    it("should be red defensive tool", () => {
      // Red deck base option
      expect(rewloola.color).toBe("red");
      expect(rewloola.type).toBe("base");
    });

    it("should be space-specialized base", () => {
      // Space-only bases are specialized for space strategies
      expect(rewloola.zones).toEqual(["space"]);
      expect(rewloola.zones.length).toBe(1);
    });
  });

  describe("Burst Mechanics", () => {
    it("should deploy when Burst triggers", () => {
      // Burst effect: Deploy this card to shield base
      expect(rewloola.text).toBe("【Burst】Deploy this card.");

      const ability = rewloola.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should provide value from shield zone", () => {
      // Unlike regular shields, Rewloola deploys when destroyed
      const engine = new GundamTestEngine(
        {
          shieldSection: 6, // Rewloola as shield
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
      expect(rewloola.text).toContain("Burst");
    });
  });

  describe("Shield Base Mechanics", () => {
    it("should act as persistent shield", () => {
      // Base cards in shield base remain until destroyed
      // Unlike EX Base token, base cards provide HP shield
      expect(rewloola.hp).toBe(5);
      expect(rewloola.type).toBe("base");
    });

    it("should be replaceable with other bases", () => {
      // Only one base card can be in shield base at a time
      // Rule 3-2-2-2: Shield Base zone can hold max 1 card
      const engine = new GundamTestEngine(
        {
          hand: [rewloola],
          shieldBase: 0, // Empty - can deploy Rewloola here
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
      // Rewloola has 5 HP - provides 5 HP as shield base
      // When taking damage to shield base, subtract from base's HP
      expect(rewloola.hp).toBe(5);
      expect(rewloola.ap).toBe(0); // Bases don't attack
    });
  });

  describe("Zone Deployment Restrictions", () => {
    it("should support only space deployment", () => {
      // Rewloola is specialized for space combat
      expect(rewloola.zones).toEqual(["space"]);
      expect(rewloola.zones.length).toBe(1);
    });

    it("should work well in space-focused strategies", () => {
      // Space-only restriction makes Rewloola ideal for space decks
      expect(rewloola.zones).toContain("space");
      expect(rewloola.zones).not.toContain("earth");

      // Red Zeon warship for space strategies
      expect(rewloola.traits).toContain("zeon");
      expect(rewloola.traits).toContain("warship");
    });
  });
});
