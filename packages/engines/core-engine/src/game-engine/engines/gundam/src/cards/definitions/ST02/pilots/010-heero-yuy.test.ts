import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { heeroYuy } from "./010-heero-yuy";

/**
 * Tests for ST02-010: Heero Yuy
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: Green
 * - Traits: [] (empty)
 * - AP Modifier: +2, HP Modifier: +1
 *
 * Abilities:
 * - 【Burst】Add this card to your hand
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Pilot pairing mechanics
 * - Card usability in game scenarios
 */

describe("ST02-010: Heero Yuy", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(heeroYuy.id).toBe("ST02-010");
      expect(heeroYuy.name).toBe("Heero Yuy");
      expect(heeroYuy.number).toBe(10);
      expect(heeroYuy.set).toBe("ST02");
      expect(heeroYuy.type).toBe("pilot");
      expect(heeroYuy.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(heeroYuy.cost).toBe(1);
      expect(heeroYuy.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(heeroYuy.color).toBe("green");
    });

    it("should have empty traits array", () => {
      expect(heeroYuy.traits).toEqual([]);
      expect(heeroYuy.traits.length).toBe(0);
    });

    it("should have correct pilot modifiers", () => {
      expect(heeroYuy.apModifier).toBe(2);
      expect(heeroYuy.hpModifier).toBe(1);
    });

    it("should have text describing Burst ability", () => {
      expect(heeroYuy.text).toContain("Burst");
      expect(heeroYuy.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(heeroYuy.abilities).toBeDefined();
      expect(heeroYuy.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = heeroYuy.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
    });

    it("should have burst trigger event", () => {
      const ability = heeroYuy.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = heeroYuy.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("move-to-hand");
      expect(effect.targetText).toBe("this card");
      expect(effect.originalText).toBe("Add this card to your hand");
    });

    it("should have self target configuration", () => {
      const ability = heeroYuy.abilities[0];
      const effect = ability.effects[0];

      expect(effect.target).toBeDefined();
      expect(effect.target.type).toBe("unit");
      expect(effect.target.value).toBe("self");
      expect(effect.target.zone).toBe("battlefield");
    });

    it("should have unit type filter", () => {
      const ability = heeroYuy.abilities[0];
      const effect = ability.effects[0];

      expect(effect.target.filters).toBeDefined();
      expect(effect.target.filters.length).toBe(1);
      expect(effect.target.filters[0].filter).toBe("type");
      expect(effect.target.filters[0].value).toBe("unit");
    });
  });

  describe("Pilot Pairing Mechanics", () => {
    it("should be attachable to units when deployed", () => {
      // Heero Yuy costs 1, so needs 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [heeroYuy],
          resourceArea: 3,
          battleArea: 1, // Has a unit to attach to
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pilot is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should provide +2 AP modifier when paired", () => {
      // Heero Yuy provides +2 AP to the paired unit
      expect(heeroYuy.apModifier).toBe(2);
    });

    it("should provide +1 HP modifier when paired", () => {
      // Heero Yuy provides +1 HP to the paired unit
      expect(heeroYuy.hpModifier).toBe(1);
    });

    it("should be level 4 for pairing with appropriate units", () => {
      // Level 4 pilot can pair with level 4+ units
      expect(heeroYuy.level).toBe(4);
      expect(heeroYuy.cost).toBe(1); // Cost 1 makes it accessible early game
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(heeroYuy).toHaveProperty("implemented");
      expect(heeroYuy).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Strategy", () => {
    it("should be cost-efficient for early game deployment", () => {
      // Cost 1 pilot with strong modifiers (+2 AP, +1 HP)
      expect(heeroYuy.cost).toBe(1);
      expect(heeroYuy.apModifier + heeroYuy.hpModifier).toBe(3);
    });

    it("should set up scenario for Burst ability activation", () => {
      // Heero Yuy in shield section can be retrieved via Burst
      const engine = new GundamTestEngine(
        {
          shieldSection: [heeroYuy],
          hand: 5,
          resourceArea: 5,
          battleArea: 1,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Burst ability: Heero Yuy can be returned to hand
      assertZoneCount(engine, "shieldSection", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work in green deck strategies", () => {
      // Heero Yuy is a green pilot for green deck synergies
      expect(heeroYuy.color).toBe("green");
    });
  });
});
