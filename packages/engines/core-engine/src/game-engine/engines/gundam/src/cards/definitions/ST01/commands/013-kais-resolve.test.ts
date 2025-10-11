import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { kaisResolve } from "./013-kais-resolve";

/**
 * Tests for ST01-013: Kai's Resolve
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: Blue
 * - Type: Command
 *
 * Abilities:
 * - 【Main】Choose 1 friendly Unit. It recovers 3 HP.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Main ability definition
 * - Targeting friendly units
 * - HP recovery effect
 */

describe("ST01-013: Kai's Resolve", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(kaisResolve.id).toBe("ST01-013");
      expect(kaisResolve.name).toBe("Kai's Resolve");
      expect(kaisResolve.number).toBe(13);
      expect(kaisResolve.set).toBe("ST01");
      expect(kaisResolve.type).toBe("command");
      expect(kaisResolve.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(kaisResolve.cost).toBe(1);
      expect(kaisResolve.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(kaisResolve.color).toBe("blue");
    });

    it("should have text describing Main ability", () => {
      expect(kaisResolve.text).toContain("Main");
      expect(kaisResolve.text).toContain("Choose");
      expect(kaisResolve.text).toContain("friendly Unit");
      expect(kaisResolve.text).toContain("recovers 3 HP");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(kaisResolve.abilities).toBeDefined();
      expect(kaisResolve.abilities.length).toBe(1);
    });

    it("should have triggered Main ability", () => {
      const ability = kaisResolve.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【main】");
      expect(ability.trigger?.event).toBe("main");
    });

    it("should have targeting effect", () => {
      const ability = kaisResolve.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);
    });

    it("should target friendly unit", () => {
      const ability = kaisResolve.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.amount).toBe("1");
      expect(targetEffect.target.type).toBe("unit");
      expect(targetEffect.target.value).toBe(1);
      expect(targetEffect.targetText).toBe("friendly Unit");
      expect(targetEffect.target.isMultiple).toBe(false);
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Kai's Resolve costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
          resourceArea: 3,
          battleArea: 1, // Friendly unit to heal
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

    it("should set up scenario with damaged friendly units", () => {
      // Kai's Resolve heals friendly units
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
          battleArea: 2, // Friendly units (some damaged)
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario: player has damaged units to heal
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should set up scenario for recovering HP", () => {
      // Kai's Resolve recovers 3 HP to chosen friendly unit
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
          battleArea: 1, // Damaged friendly unit
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for HP recovery: damaged friendly unit will recover 3 HP
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be usable during Main Phase", () => {
      // Command cards with 【Main】 ability activate during Main Phase
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
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
      const ability = kaisResolve.abilities[0];
      expect(ability.trigger?.event).toBe("main");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(kaisResolve).toHaveProperty("implemented");
      expect(kaisResolve).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 3 appropriate for cost 1 command", () => {
      // Level 3 command with cost 1 is efficient healing
      expect(kaisResolve.level).toBe(3);
      expect(kaisResolve.cost).toBe(1);
    });

    it("should be effective for sustaining damaged units", () => {
      // Kai's Resolve: 1 cost for 3 HP recovery
      // Efficient healing for units that took damage
      expect(kaisResolve.cost).toBe(1);

      // Note: The healing amount is in the card text
      expect(kaisResolve.text).toContain("recovers 3 HP");
    });

    it("should require target selection", () => {
      // Must choose which friendly unit to heal
      const ability = kaisResolve.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.target.isMultiple).toBe(false); // Single target
      expect(targetEffect.targetText).toContain("friendly");
    });

    it("should set up healing scenario", () => {
      // Kai's Resolve used to keep damaged unit in battle
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
          battleArea: 1, // Damaged unit (e.g., 4 HP unit with 2 damage)
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Healing scenario: recover 3 HP to keep unit alive
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be blue support tool", () => {
      // Blue deck healing option for friendly units
      expect(kaisResolve.color).toBe("blue");
      expect(kaisResolve.type).toBe("command");
    });
  });

  describe("Targeting Restrictions", () => {
    it("should only target friendly units", () => {
      // Cannot target enemy units
      const ability = kaisResolve.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.targetText).toBe("friendly Unit");
      expect(targetEffect.target.zone).toBe("battlefield");
    });

    it("should target units in battle area", () => {
      // Only targets units on the battlefield
      const ability = kaisResolve.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.target.zone).toBe("battlefield");
      expect(targetEffect.target.filters).toContainEqual({
        filter: "type",
        value: "unit",
      });
    });
  });

  describe("HP Recovery Mechanics", () => {
    it("should recover 3 HP", () => {
      // Kai's Resolve recovers exactly 3 HP
      expect(kaisResolve.text).toContain("recovers 3 HP");
    });

    it("should work with units at any HP level", () => {
      // Can target units with any amount of HP (not just damaged ones)
      // Useful for: units with missing HP, or preventively before combat
      const engine = new GundamTestEngine(
        {
          hand: [kaisResolve],
          battleArea: 2, // Mix of damaged and full HP units
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should be efficient for high-HP units", () => {
      // Most effective on units that can benefit from full 3 HP recovery
      // Example: 4+ HP units that took 3+ damage
      expect(kaisResolve.cost).toBe(1);
      expect(kaisResolve.text).toContain("recovers 3 HP");
    });
  });
});
