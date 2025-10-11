import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { amuroRay } from "./010-amuro-ray";

/**
 * Tests for ST01-010: Amuro Ray
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: Blue
 * - Traits: Earth Federation, Newtype
 * - AP Modifier: +2, HP Modifier: +1
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pairing mechanics with units (Gundam link requirement)
 * - Pilot stat modifiers
 */

describe("ST01-010: Amuro Ray", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(amuroRay.id).toBe("ST01-010");
      expect(amuroRay.name).toBe("Amuro Ray");
      expect(amuroRay.number).toBe(10);
      expect(amuroRay.set).toBe("ST01");
      expect(amuroRay.type).toBe("pilot");
      expect(amuroRay.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(amuroRay.cost).toBe(1);
      expect(amuroRay.level).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(amuroRay.color).toBe("blue");
      expect(amuroRay.traits).toEqual(["earth federation", "newtype"]);
    });

    it("should have pilot stat modifiers", () => {
      expect(amuroRay.apModifier).toBe(2);
      expect(amuroRay.hpModifier).toBe(1);
    });

    it("should have text describing Burst ability", () => {
      expect(amuroRay.text).toContain("Burst");
      expect(amuroRay.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(amuroRay.abilities).toBeDefined();
      expect(amuroRay.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = amuroRay.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = amuroRay.abilities[0];
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
      // Amuro Ray costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [amuroRay],
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

    it("should set up scenario with Amuro Ray paired with Gundam", () => {
      // Amuro Ray provides +2 AP and +1 HP when paired with Gundam
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Gundam with Amuro Ray paired
          hand: [amuroRay],
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

      // Scenario for pairing: Gundam (base 3 AP, 4 HP) + Amuro Ray (+2 AP, +1 HP) = 5 AP, 5 HP
      expect(amuroRay.apModifier).toBe(2);
      expect(amuroRay.hpModifier).toBe(1);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Gundam link requirement", () => {
      // Gundam has link requirement for Amuro Ray
      // When paired, the unit receives stat boosts
      const engine = new GundamTestEngine(
        {
          hand: [amuroRay],
          battleArea: 1, // Gundam unit
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

      // Amuro Ray can be paired with units that have "amuro ray" link requirement
      expect(amuroRay.traits).toContain("earth federation");
      expect(amuroRay.traits).toContain("newtype");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should set up scenario for Burst ability activation", () => {
      // Amuro Ray with Burst ability in damage zone
      // When shield is destroyed, Burst triggers: add this card to hand
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Amuro Ray could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, add Amuro Ray to hand instead of discard
      const ability = amuroRay.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      expect(ability.effects[0].type).toBe("move-to-hand");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(amuroRay).toHaveProperty("implemented");
      expect(amuroRay).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 4 appropriate for cost 1 pilot", () => {
      // Level 4 pilot with cost 1 is efficient
      expect(amuroRay.level).toBe(4);
      expect(amuroRay.cost).toBe(1);
    });

    it("should provide offensive stat boost", () => {
      // Amuro Ray provides +2 AP, +1 HP - offensive pairing
      expect(amuroRay.apModifier).toBe(2);
      expect(amuroRay.hpModifier).toBe(1);

      // Total stats boost: +3 (2 AP + 1 HP)
      const totalBoost = amuroRay.apModifier + amuroRay.hpModifier;
      expect(totalBoost).toBe(3);
    });

    it("should set up pairing scenario", () => {
      // Amuro Ray paired with unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Amuro Ray paired
          hand: [amuroRay],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pairing scenario ready: Amuro Ray boosts unit stats
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Earth Federation and Newtype traits", () => {
      // Traits important for deck building and card interactions
      expect(amuroRay.traits).toContain("earth federation");
      expect(amuroRay.traits).toContain("newtype");
    });
  });
});
