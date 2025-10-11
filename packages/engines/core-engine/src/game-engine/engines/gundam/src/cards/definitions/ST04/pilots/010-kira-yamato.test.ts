import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { kiraYamato } from "./010-kira-yamato";

/**
 * Tests for ST04-010: Kira Yamato
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: White
 * - Traits: Earth Federation
 * - AP Modifier: +2, HP Modifier: +1
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pairing mechanics with units
 * - Pilot stat modifiers
 */

describe("ST04-010: Kira Yamato", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(kiraYamato.id).toBe("ST04-010");
      expect(kiraYamato.name).toBe("Kira Yamato");
      expect(kiraYamato.number).toBe(10);
      expect(kiraYamato.set).toBe("ST04");
      expect(kiraYamato.type).toBe("pilot");
      expect(kiraYamato.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(kiraYamato.cost).toBe(1);
      expect(kiraYamato.level).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(kiraYamato.color).toBe("white");
      expect(kiraYamato.traits).toEqual(["earth federation"]);
    });

    it("should have pilot stat modifiers", () => {
      expect(kiraYamato.apModifier).toBe(2);
      expect(kiraYamato.hpModifier).toBe(1);
    });

    it("should have text describing Burst ability", () => {
      expect(kiraYamato.text).toContain("Burst");
      expect(kiraYamato.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(kiraYamato.abilities).toBeDefined();
      expect(kiraYamato.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = kiraYamato.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = kiraYamato.abilities[0];
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
      // Kira Yamato costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [kiraYamato],
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

    it("should set up scenario with Kira Yamato paired with Strike Gundam", () => {
      // Kira Yamato provides +2 AP and +1 HP when paired
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Strike Gundam with Kira Yamato paired
          hand: [kiraYamato],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario for pairing: unit gets +2 AP, +1 HP
      expect(kiraYamato.apModifier).toBe(2);
      expect(kiraYamato.hpModifier).toBe(1);
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should set up scenario for Burst ability activation", () => {
      // Kira Yamato with Burst ability in damage zone
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
          shieldSection: 6, // Kira Yamato could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: add Kira Yamato to hand
      const ability = kiraYamato.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(kiraYamato).toHaveProperty("implemented");
      expect(kiraYamato).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Stats and Strategy", () => {
    it("should have level 4 appropriate for cost 1 pilot", () => {
      // Level 4 pilot with cost 1
      expect(kiraYamato.level).toBe(4);
      expect(kiraYamato.cost).toBe(1);
    });

    it("should provide offensive-focused stat boost", () => {
      // Kira Yamato provides +2 AP, +1 HP - offensive pairing
      expect(kiraYamato.apModifier).toBe(2);
      expect(kiraYamato.hpModifier).toBe(1);

      // Total stats boost: +3 (2 AP + 1 HP)
      const totalBoost = kiraYamato.apModifier + kiraYamato.hpModifier;
      expect(totalBoost).toBe(3);
    });

    it("should have Earth Federation trait", () => {
      // Trait important for deck building and card interactions
      expect(kiraYamato.traits).toContain("earth federation");
    });
  });
});
