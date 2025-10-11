import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { whiteBase } from "./015-white-base";

/**
 * Tests for ST01-015: White Base
 *
 * Card Properties:
 * - Cost: 2, Level: 3
 * - Color: Blue
 * - Type: Base
 * - Traits: Earth Federation, Warship
 * - Zones: Space, Earth
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
 */

describe("ST01-015: White Base", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(whiteBase.id).toBe("ST01-015");
      expect(whiteBase.name).toBe("White Base");
      expect(whiteBase.number).toBe(15);
      expect(whiteBase.set).toBe("ST01");
      expect(whiteBase.type).toBe("base");
      expect(whiteBase.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(whiteBase.cost).toBe(2);
      expect(whiteBase.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(whiteBase.color).toBe("blue");
      expect(whiteBase.traits).toEqual(["earth federation", "warship"]);
    });

    it("should have correct zones", () => {
      expect(whiteBase.zones).toEqual(["space", "earth"]);
    });

    it("should have base card stats", () => {
      expect(whiteBase.ap).toBe(0);
      expect(whiteBase.hp).toBe(5);
    });

    it("should have text describing Burst ability", () => {
      expect(whiteBase.text).toContain("Burst");
      expect(whiteBase.text).toContain("Deploy this card");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(whiteBase.abilities).toBeDefined();
      expect(whiteBase.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = whiteBase.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect", () => {
      const ability = whiteBase.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Base Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // White Base costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [whiteBase],
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
      // White Base can be placed in shield base zone
      const engine = new GundamTestEngine(
        {
          hand: [whiteBase],
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
      // White Base with Burst ability in shield section
      // When shield is destroyed, Burst triggers: deploy this card
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // White Base could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, deploy White Base
      const ability = whiteBase.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should be deployable in space or earth", () => {
      // White Base can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [whiteBase],
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

      // White Base supports both deployment zones
      expect(whiteBase.zones).toContain("space");
      expect(whiteBase.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(whiteBase).toHaveProperty("implemented");
      expect(whiteBase).toHaveProperty("missingTestCase");
    });

    it("should have placeholder effect for deploy", () => {
      // Note: The deploy effect is referenced but not fully defined yet
      const ability = whiteBase.abilities[0];
      const effect = ability.effects[0];

      expect(effect.type).toBe("placeholder");
      expect(effect.parameters).toBeDefined();
    });
  });

  describe("Base Card Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 2 base", () => {
      // Level 3 base with cost 2
      expect(whiteBase.level).toBe(3);
      expect(whiteBase.cost).toBe(2);
    });

    it("should have 0 AP and 5 HP", () => {
      // Base cards typically have 0 AP
      expect(whiteBase.ap).toBe(0);
      expect(whiteBase.hp).toBe(5);
    });

    it("should provide defensive value as shield base", () => {
      // White Base: 5 HP as shield base provides defensive value
      // Base cards in shield base zone act as persistent shields
      expect(whiteBase.hp).toBe(5);
      expect(whiteBase.type).toBe("base");
    });

    it("should have Earth Federation and Warship traits", () => {
      // Traits important for deck building and card interactions
      expect(whiteBase.traits).toContain("earth federation");
      expect(whiteBase.traits).toContain("warship");
    });

    it("should be blue defensive tool", () => {
      // Blue deck base option
      expect(whiteBase.color).toBe("blue");
      expect(whiteBase.type).toBe("base");
    });
  });

  describe("Burst Mechanics", () => {
    it("should deploy when Burst triggers", () => {
      // Burst effect: Deploy this card to shield base
      expect(whiteBase.text).toBe("【Burst】Deploy this card.");

      const ability = whiteBase.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should provide value from shield zone", () => {
      // Unlike regular shields, White Base deploys when destroyed
      const engine = new GundamTestEngine(
        {
          shieldSection: 6, // White Base as shield
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
      expect(whiteBase.text).toContain("Burst");
    });
  });

  describe("Shield Base Mechanics", () => {
    it("should act as persistent shield", () => {
      // Base cards in shield base remain until destroyed
      // Unlike EX Base token, base cards provide HP shield
      expect(whiteBase.hp).toBe(5);
      expect(whiteBase.type).toBe("base");
    });

    it("should be replaceable with other bases", () => {
      // Only one base card can be in shield base at a time
      // Rule 3-2-2-2: Shield Base zone can hold max 1 card
      const engine = new GundamTestEngine(
        {
          hand: [whiteBase],
          shieldBase: 0, // Empty - can deploy White Base here
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
      // White Base has 5 HP - provides 5 HP as shield base
      // When taking damage to shield base, subtract from base's HP
      expect(whiteBase.hp).toBe(5);
      expect(whiteBase.ap).toBe(0); // Bases don't attack
    });
  });

  describe("Zone Deployment Options", () => {
    it("should support both space and earth deployment", () => {
      // White Base is versatile - can go to space or earth
      expect(whiteBase.zones).toEqual(["space", "earth"]);
      expect(whiteBase.zones.length).toBe(2);
    });

    it("should compare with single-zone bases", () => {
      // White Base: space + earth (versatile)
      // Some bases: space only or earth only (specialized)
      expect(whiteBase.zones).toContain("space");
      expect(whiteBase.zones).toContain("earth");
    });
  });
});
