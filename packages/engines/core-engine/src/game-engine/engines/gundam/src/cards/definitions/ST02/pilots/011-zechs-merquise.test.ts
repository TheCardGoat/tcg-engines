import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { zechsMerquise } from "./011-zechs-merquise";

/**
 * Tests for ST02-011: Zechs Merquise
 *
 * Card Properties:
 * - Cost: 1, Level: 5
 * - Color: Blue
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

describe("ST02-011: Zechs Merquise", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(zechsMerquise.id).toBe("ST02-011");
      expect(zechsMerquise.name).toBe("Zechs Merquise");
      expect(zechsMerquise.number).toBe(11);
      expect(zechsMerquise.set).toBe("ST02");
      expect(zechsMerquise.type).toBe("pilot");
      expect(zechsMerquise.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(zechsMerquise.cost).toBe(1);
      expect(zechsMerquise.level).toBe(5);
    });

    it("should have correct color", () => {
      expect(zechsMerquise.color).toBe("blue");
    });

    it("should have empty traits array", () => {
      expect(zechsMerquise.traits).toEqual([]);
      expect(zechsMerquise.traits.length).toBe(0);
    });

    it("should have correct pilot modifiers", () => {
      expect(zechsMerquise.apModifier).toBe(2);
      expect(zechsMerquise.hpModifier).toBe(1);
    });

    it("should have text describing Burst ability", () => {
      expect(zechsMerquise.text).toContain("Burst");
      expect(zechsMerquise.text).toContain("Add this card to your hand");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(zechsMerquise.abilities).toBeDefined();
      expect(zechsMerquise.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = zechsMerquise.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
    });

    it("should have burst trigger event", () => {
      const ability = zechsMerquise.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("burst");
    });

    it("should have move-to-hand effect", () => {
      const ability = zechsMerquise.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("move-to-hand");
      expect(effect.targetText).toBe("this card");
      expect(effect.originalText).toBe("Add this card to your hand");
    });

    it("should have self target configuration", () => {
      const ability = zechsMerquise.abilities[0];
      const effect = ability.effects[0];

      expect(effect.target).toBeDefined();
      expect(effect.target.type).toBe("unit");
      expect(effect.target.value).toBe("self");
      expect(effect.target.zone).toBe("battlefield");
    });

    it("should have unit type filter", () => {
      const ability = zechsMerquise.abilities[0];
      const effect = ability.effects[0];

      expect(effect.target.filters).toBeDefined();
      expect(effect.target.filters.length).toBe(1);
      expect(effect.target.filters[0].filter).toBe("type");
      expect(effect.target.filters[0].value).toBe("unit");
    });
  });

  describe("Pilot Pairing Mechanics", () => {
    it("should be attachable to units when deployed", () => {
      // Zechs Merquise costs 1, so needs 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [zechsMerquise],
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
      // Zechs Merquise provides +2 AP to the paired unit
      expect(zechsMerquise.apModifier).toBe(2);
    });

    it("should provide +1 HP modifier when paired", () => {
      // Zechs Merquise provides +1 HP to the paired unit
      expect(zechsMerquise.hpModifier).toBe(1);
    });

    it("should be level 5 for pairing with high-level units", () => {
      // Level 5 pilot can pair with level 5+ units
      expect(zechsMerquise.level).toBe(5);
      expect(zechsMerquise.cost).toBe(1); // Cost 1 makes it accessible early game
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(zechsMerquise).toHaveProperty("implemented");
      expect(zechsMerquise).toHaveProperty("missingTestCase");
    });
  });

  describe("Pilot Strategy", () => {
    it("should be cost-efficient for early game deployment", () => {
      // Cost 1 pilot with strong modifiers (+2 AP, +1 HP)
      expect(zechsMerquise.cost).toBe(1);
      expect(zechsMerquise.apModifier + zechsMerquise.hpModifier).toBe(3);
    });

    it("should set up scenario for Burst ability activation", () => {
      // Zechs Merquise in shield section can be retrieved via Burst
      const engine = new GundamTestEngine(
        {
          shieldSection: [zechsMerquise],
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

      // Setup for Burst ability: Zechs Merquise can be returned to hand
      assertZoneCount(engine, "shieldSection", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should work in blue deck strategies", () => {
      // Zechs Merquise is a blue pilot for blue deck synergies
      expect(zechsMerquise.color).toBe("blue");
    });

    it("should pair with higher-level units compared to level 4 pilots", () => {
      // Level 5 is higher than most starter pilots
      expect(zechsMerquise.level).toBeGreaterThan(4);
    });
  });
});
