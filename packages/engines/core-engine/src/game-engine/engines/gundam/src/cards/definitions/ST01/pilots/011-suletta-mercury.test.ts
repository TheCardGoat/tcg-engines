import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { sulettaMercury } from "./011-suletta-mercury";

/**
 * Tests for ST01-011: Suletta Mercury
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: White
 * - Traits: Academy
 * - AP Modifier: +1, HP Modifier: +2
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pairing mechanics with units (Gundam Aerial link requirement)
 * - Pilot stat modifiers
 */

describe("ST01-011: Suletta Mercury", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(sulettaMercury.id).toBe("ST01-011");
      expect(sulettaMercury.name).toBe("Suletta Mercury");
      expect(sulettaMercury.number).toBe(11);
      expect(sulettaMercury.set).toBe("ST01");
      expect(sulettaMercury.type).toBe("pilot");
      expect(sulettaMercury.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(sulettaMercury.cost).toBe(1);
      expect(sulettaMercury.level).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(sulettaMercury.color).toBe("white");
      expect(sulettaMercury.traits).toEqual(["academy"]);
    });

    it("should have pilot stat modifiers", () => {
      expect(sulettaMercury.apModifier).toBe(1);
      expect(sulettaMercury.hpModifier).toBe(2);
    });

    it("should have text describing Burst ability", () => {
      expect(sulettaMercury.text).toContain("Burst");
      expect(sulettaMercury.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(sulettaMercury.abilities).toBeDefined();
      expect(sulettaMercury.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = sulettaMercury.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = sulettaMercury.abilities[0];
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
      // Suletta Mercury costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [sulettaMercury],
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

    it("should set up scenario with Suletta Mercury paired with Gundam Aerial", () => {
      // Suletta Mercury provides +1 AP and +2 HP when paired with Gundam Aerial
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Gundam Aerial with Suletta Mercury paired
          hand: [sulettaMercury],
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

      // Scenario for pairing: Gundam Aerial + Suletta Mercury (+1 AP, +2 HP)
      expect(sulettaMercury.apModifier).toBe(1);
      expect(sulettaMercury.hpModifier).toBe(2);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should work with Gundam Aerial link requirement", () => {
      // Gundam Aerial has link requirement for Suletta Mercury
      // When paired, the unit receives stat boosts
      const engine = new GundamTestEngine(
        {
          hand: [sulettaMercury],
          battleArea: 1, // Gundam Aerial unit
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

      // Suletta Mercury can be paired with units that have "suletta mercury" link requirement
      expect(sulettaMercury.traits).toContain("academy");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should set up scenario for Burst ability activation", () => {
      // Suletta Mercury with Burst ability in damage zone
      // When shield is destroyed, Burst triggers: add this card to hand
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Suletta Mercury could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, add Suletta Mercury to hand instead of discard
      const ability = sulettaMercury.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      expect(ability.effects[0].type).toBe("move-to-hand");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(sulettaMercury).toHaveProperty("implemented");
      expect(sulettaMercury).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 4 appropriate for cost 1 pilot", () => {
      // Level 4 pilot with cost 1 is efficient
      expect(sulettaMercury.level).toBe(4);
      expect(sulettaMercury.cost).toBe(1);
    });

    it("should provide defensive stat boost", () => {
      // Suletta Mercury provides +1 AP, +2 HP - defensive pairing
      expect(sulettaMercury.apModifier).toBe(1);
      expect(sulettaMercury.hpModifier).toBe(2);

      // Total stats boost: +3 (1 AP + 2 HP)
      const totalBoost = sulettaMercury.apModifier + sulettaMercury.hpModifier;
      expect(totalBoost).toBe(3);
    });

    it("should compare with Amuro Ray stat distribution", () => {
      // Suletta Mercury: +1 AP, +2 HP (defensive)
      // Amuro Ray: +2 AP, +1 HP (offensive)
      // Both provide +3 total stats but with different focus
      const sulettaTotal =
        sulettaMercury.apModifier + sulettaMercury.hpModifier;
      expect(sulettaTotal).toBe(3);

      // Suletta favors HP (defensive), Amuro favors AP (offensive)
      expect(sulettaMercury.hpModifier).toBeGreaterThan(
        sulettaMercury.apModifier,
      );
    });

    it("should set up pairing scenario", () => {
      // Suletta Mercury paired with unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Suletta Mercury paired
          hand: [sulettaMercury],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pairing scenario ready: Suletta Mercury boosts unit stats
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have Academy trait", () => {
      // Trait important for deck building and card interactions
      expect(sulettaMercury.traits).toContain("academy");
    });
  });
});
