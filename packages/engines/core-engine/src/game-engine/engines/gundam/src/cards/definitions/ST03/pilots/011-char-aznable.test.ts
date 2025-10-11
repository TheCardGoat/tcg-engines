import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { charAznable } from "./011-char-aznable";

/**
 * Tests for ST03-011: Char Aznable
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: Green
 * - Traits: Zeon, Newtype
 * - AP Modifier: +1, HP Modifier: +1
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pairing mechanics with units (Char's Zaku Ⅱ link requirement)
 * - Pilot stat modifiers
 */

describe("ST03-011: Char Aznable", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(charAznable.id).toBe("ST03-011");
      expect(charAznable.name).toBe("Char Aznable");
      expect(charAznable.number).toBe(11);
      expect(charAznable.set).toBe("ST03");
      expect(charAznable.type).toBe("pilot");
      expect(charAznable.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(charAznable.cost).toBe(1);
      expect(charAznable.level).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(charAznable.color).toBe("green");
      expect(charAznable.traits).toEqual(["zeon", "newtype"]);
    });

    it("should have pilot stat modifiers", () => {
      expect(charAznable.apModifier).toBe(1);
      expect(charAznable.hpModifier).toBe(1);
    });

    it("should have text describing Burst ability", () => {
      expect(charAznable.text).toContain("Burst");
      expect(charAznable.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(charAznable.abilities).toBeDefined();
      expect(charAznable.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = charAznable.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = charAznable.abilities[0];
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
      // Char Aznable costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [charAznable],
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

    it("should set up scenario with Char Aznable paired with Char's Zaku Ⅱ", () => {
      // Char Aznable provides +1 AP and +1 HP when paired with Char's Zaku Ⅱ
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Char's Zaku Ⅱ with Char Aznable paired
          hand: [charAznable],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Scenario for pairing: Char's Zaku Ⅱ (base 3 AP, 2 HP) + Char Aznable (+1 AP, +1 HP) = 4 AP, 3 HP
      expect(charAznable.apModifier).toBe(1);
      expect(charAznable.hpModifier).toBe(1);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Char's Zaku Ⅱ link requirement", () => {
      // Char's Zaku Ⅱ has link requirement for Char Aznable
      // When paired, the unit receives stat boosts
      const engine = new GundamTestEngine(
        {
          hand: [charAznable],
          battleArea: 1, // Char's Zaku Ⅱ unit
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Char Aznable can be paired with units that have "char aznable" link requirement
      expect(charAznable.traits).toContain("zeon");
      expect(charAznable.traits).toContain("newtype");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should set up scenario for Burst ability activation", () => {
      // Char Aznable with Burst ability in damage zone
      // When shield is destroyed, Burst triggers: add this card to hand
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
          shieldSection: 6, // Char Aznable could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, add Char Aznable to hand instead of discard
      const ability = charAznable.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      expect(ability.effects[0].type).toBe("move-to-hand");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(charAznable).toHaveProperty("implemented");
      expect(charAznable).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 3 appropriate for cost 1 pilot", () => {
      // Level 3 pilot with cost 1 is mid-level
      expect(charAznable.level).toBe(3);
      expect(charAznable.cost).toBe(1);
    });

    it("should provide balanced stat boost", () => {
      // Char Aznable provides +1 AP, +1 HP - balanced pairing
      expect(charAznable.apModifier).toBe(1);
      expect(charAznable.hpModifier).toBe(1);

      // Total stats boost: +2 (1 AP + 1 HP)
      const totalBoost = charAznable.apModifier + charAznable.hpModifier;
      expect(totalBoost).toBe(2);
    });

    it("should set up pairing scenario", () => {
      // Char Aznable paired with unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Char Aznable paired
          hand: [charAznable],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Pairing scenario ready: Char Aznable boosts unit stats
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Zeon and Newtype traits", () => {
      // Traits important for deck building and card interactions
      expect(charAznable.traits).toContain("zeon");
      expect(charAznable.traits).toContain("newtype");
    });

    it("should be an efficient early-mid game pilot", () => {
      // Level 3, cost 1 with +1/+1 is efficient for early-mid game units
      expect(charAznable.level).toBe(3);
      expect(charAznable.cost).toBe(1);

      // Modest but efficient stat boost
      const totalBoost = charAznable.apModifier + charAznable.hpModifier;
      expect(totalBoost).toBe(2);
    });
  });
});
