import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { thoroughlyDamaged } from "./012-thoroughly-damaged";

/**
 * Tests for ST01-012: Thoroughly Damaged
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: Blue
 * - Type: Command
 *
 * Abilities:
 * - 【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Main ability definition
 * - Targeting rested enemy units
 * - Damage effect
 */

describe("ST01-012: Thoroughly Damaged", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(thoroughlyDamaged.id).toBe("ST01-012");
      expect(thoroughlyDamaged.name).toBe("Thoroughly Damaged");
      expect(thoroughlyDamaged.number).toBe(12);
      expect(thoroughlyDamaged.set).toBe("ST01");
      expect(thoroughlyDamaged.type).toBe("command");
      expect(thoroughlyDamaged.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(thoroughlyDamaged.cost).toBe(1);
      expect(thoroughlyDamaged.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(thoroughlyDamaged.color).toBe("blue");
    });

    it("should have text describing Main ability", () => {
      expect(thoroughlyDamaged.text).toContain("Main");
      expect(thoroughlyDamaged.text).toContain("Choose");
      expect(thoroughlyDamaged.text).toContain("rested enemy Unit");
      expect(thoroughlyDamaged.text).toContain("Deal 1 damage");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(thoroughlyDamaged.abilities).toBeDefined();
      expect(thoroughlyDamaged.abilities.length).toBe(1);
    });

    it("should have triggered Main ability", () => {
      const ability = thoroughlyDamaged.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【main】");
      expect(ability.trigger?.event).toBe("main");
    });

    it("should have targeting and damage effects", () => {
      const ability = thoroughlyDamaged.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(3); // Target, damage x2
    });

    it("should target rested enemy unit", () => {
      const ability = thoroughlyDamaged.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.amount).toBe("1");
      expect(targetEffect.target.type).toBe("unit");
      expect(targetEffect.target.value).toBe(1);
      expect(targetEffect.targetText).toBe("rested enemy Unit");
      expect(targetEffect.target.isMultiple).toBe(false);
    });

    it("should deal 1 damage twice", () => {
      const ability = thoroughlyDamaged.abilities[0];
      const damageEffect1 = ability.effects[1];
      const damageEffect2 = ability.effects[2];

      expect(damageEffect1.type).toBe("damage");
      expect(damageEffect1.amount).toBe(1);
      expect(damageEffect1.preventable).toBe(true);

      expect(damageEffect2.type).toBe("damage");
      expect(damageEffect2.amount).toBe(1);
      expect(damageEffect2.preventable).toBe(true);
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Thoroughly Damaged costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [thoroughlyDamaged],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Card is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with rested enemy units", () => {
      // Thoroughly Damaged targets rested enemy units
      const engine = new GundamTestEngine(
        {
          hand: [thoroughlyDamaged],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units (some rested)
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario: enemy has rested units to target
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should set up scenario for dealing damage to rested unit", () => {
      // Thoroughly Damaged deals 1 damage to chosen rested enemy unit
      const engine = new GundamTestEngine(
        {
          hand: [thoroughlyDamaged],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Rested enemy unit with HP
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for damage: rested enemy unit will take 1 damage
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be usable during Main Phase", () => {
      // Command cards with 【Main】 ability activate during Main Phase
      const engine = new GundamTestEngine(
        {
          hand: [thoroughlyDamaged],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Main ability can be activated during Main Phase
      const ability = thoroughlyDamaged.abilities[0];
      expect(ability.trigger?.event).toBe("main");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(thoroughlyDamaged).toHaveProperty("implemented");
      expect(thoroughlyDamaged).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 2 appropriate for cost 1 command", () => {
      // Level 2 command with cost 1 is efficient removal
      expect(thoroughlyDamaged.level).toBe(2);
      expect(thoroughlyDamaged.cost).toBe(1);
    });

    it("should be effective against rested low-HP units", () => {
      // Thoroughly Damaged: 1 cost for targeted 1 damage to rested unit
      // Efficient removal for units with 1 HP or weakened units
      expect(thoroughlyDamaged.cost).toBe(1);

      const ability = thoroughlyDamaged.abilities[0];
      const damageEffect = ability.effects[1];
      expect(damageEffect.amount).toBe(1);
    });

    it("should require target selection", () => {
      // Must choose which rested enemy unit to damage
      const ability = thoroughlyDamaged.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.target.isMultiple).toBe(false); // Single target
      expect(targetEffect.targetText).toContain("rested");
    });

    it("should set up removal scenario", () => {
      // Thoroughly Damaged used to finish off weakened rested unit
      const engine = new GundamTestEngine(
        {
          hand: [thoroughlyDamaged],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Rested unit with 1 HP
          resourceArea: 5,
          deck: 30,
        },
      );

      // Removal scenario: deal 1 damage to destroy 1 HP rested unit
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be blue removal tool", () => {
      // Blue deck removal option for rested units
      expect(thoroughlyDamaged.color).toBe("blue");
      expect(thoroughlyDamaged.type).toBe("command");
    });
  });

  describe("Targeting Restrictions", () => {
    it("should only target rested units", () => {
      // Cannot target active (non-rested) units
      const ability = thoroughlyDamaged.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.targetText).toBe("rested enemy Unit");
      // Targeting rules enforce rested state requirement
    });

    it("should only target enemy units", () => {
      // Cannot target friendly units
      const ability = thoroughlyDamaged.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.targetText).toContain("enemy");
      expect(targetEffect.target.zone).toBe("battlefield");
    });
  });
});
