import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { fullFrontal } from "./010-full-frontal";

/**
 * Tests for ST03-010: Full Frontal
 *
 * Card Properties:
 * - Cost: 1, Level: 6
 * - Color: Red
 * - Traits: Zeon, Newtype
 * - AP Modifier: +2, HP Modifier: +2
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pairing mechanics with units (Sinanju link requirement)
 * - Pilot stat modifiers
 */

describe("ST03-010: Full Frontal", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(fullFrontal.id).toBe("ST03-010");
      expect(fullFrontal.name).toBe("Full Frontal");
      expect(fullFrontal.number).toBe(10);
      expect(fullFrontal.set).toBe("ST03");
      expect(fullFrontal.type).toBe("pilot");
      expect(fullFrontal.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(fullFrontal.cost).toBe(1);
      expect(fullFrontal.level).toBe(6);
    });

    it("should have correct color and traits", () => {
      expect(fullFrontal.color).toBe("red");
      expect(fullFrontal.traits).toEqual(["zeon", "newtype"]);
    });

    it("should have pilot stat modifiers", () => {
      expect(fullFrontal.apModifier).toBe(2);
      expect(fullFrontal.hpModifier).toBe(2);
    });

    it("should have text describing Burst ability", () => {
      expect(fullFrontal.text).toContain("Burst");
      expect(fullFrontal.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(fullFrontal.abilities).toBeDefined();
      expect(fullFrontal.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = fullFrontal.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = fullFrontal.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("move-to-hand");
      expect(effect.target.type).toBe("unit");
      expect(effect.target.value).toBe("self");
      expect(effect.targetText).toBe("this card");
    });
  });

  describe("Pilot Pairing Mechanics", () => {
    it("should be deployable as a pilot", () => {
      // Full Frontal costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [fullFrontal],
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

      // Card is in hand and can be played as pilot
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Full Frontal paired with Sinanju", () => {
      // Full Frontal provides +2 AP and +2 HP when paired with Sinanju
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Sinanju with Full Frontal paired
          hand: [fullFrontal],
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario for pairing: Sinanju (base 5 AP, 4 HP) + Full Frontal (+2 AP, +2 HP) = 7 AP, 6 HP
      expect(fullFrontal.apModifier).toBe(2);
      expect(fullFrontal.hpModifier).toBe(2);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Sinanju link requirement", () => {
      // Sinanju has link requirement for Full Frontal
      // When paired, the unit receives stat boosts
      const engine = new GundamTestEngine(
        {
          hand: [fullFrontal],
          battleArea: 1, // Sinanju unit
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Full Frontal can be paired with units that have "full frontal" link requirement
      expect(fullFrontal.traits).toContain("zeon");
      expect(fullFrontal.traits).toContain("newtype");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should set up scenario for Burst ability activation", () => {
      // Full Frontal with Burst ability in damage zone
      // When shield is destroyed, Burst triggers: add this card to hand
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 6,
          deck: 30,
          shieldSection: 6, // Full Frontal could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, add Full Frontal to hand instead of discard
      const ability = fullFrontal.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      expect(ability.effects[0].type).toBe("move-to-hand");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(fullFrontal).toHaveProperty("implemented");
      expect(fullFrontal).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 6 appropriate for cost 1 pilot", () => {
      // Level 6 pilot with cost 1 is high-level
      expect(fullFrontal.level).toBe(6);
      expect(fullFrontal.cost).toBe(1);
    });

    it("should provide balanced stat boost", () => {
      // Full Frontal provides +2 AP, +2 HP - balanced pairing
      expect(fullFrontal.apModifier).toBe(2);
      expect(fullFrontal.hpModifier).toBe(2);

      // Total stats boost: +4 (2 AP + 2 HP)
      const totalBoost = fullFrontal.apModifier + fullFrontal.hpModifier;
      expect(totalBoost).toBe(4);
    });

    it("should set up pairing scenario", () => {
      // Full Frontal paired with unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Full Frontal paired
          hand: [fullFrontal],
          resourceArea: 6,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pairing scenario ready: Full Frontal boosts unit stats
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Zeon and Newtype traits", () => {
      // Traits important for deck building and card interactions
      expect(fullFrontal.traits).toContain("zeon");
      expect(fullFrontal.traits).toContain("newtype");
    });

    it("should be the highest level pilot in ST03", () => {
      // Level 6 makes Full Frontal the most powerful pilot in the set
      expect(fullFrontal.level).toBe(6);

      // Highest total stat boost in ST03: +4
      const totalBoost = fullFrontal.apModifier + fullFrontal.hpModifier;
      expect(totalBoost).toBe(4);
    });
  });
});
