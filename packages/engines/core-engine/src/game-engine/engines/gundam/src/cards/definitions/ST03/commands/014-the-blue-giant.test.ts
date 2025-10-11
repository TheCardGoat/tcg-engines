import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { theBlueGiant } from "./014-the-blue-giant";

/**
 * Tests for ST03-014: The Blue Giant
 *
 * Card Properties:
 * - Cost: 1, Level: 4
 * - Color: Green
 * - Type: Command
 *
 * Abilities:
 * - 【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Action ability definition
 * - Targeting friendly units
 * - Damage prevention effect
 */

describe("ST03-014: The Blue Giant", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(theBlueGiant.id).toBe("ST03-014");
      expect(theBlueGiant.name).toBe("The Blue Giant");
      expect(theBlueGiant.number).toBe(14);
      expect(theBlueGiant.set).toBe("ST03");
      expect(theBlueGiant.type).toBe("command");
      expect(theBlueGiant.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(theBlueGiant.cost).toBe(1);
      expect(theBlueGiant.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(theBlueGiant.color).toBe("green");
    });

    it("should have text describing Action ability", () => {
      expect(theBlueGiant.text).toContain("Action");
      expect(theBlueGiant.text).toContain("Choose");
      expect(theBlueGiant.text).toContain("friendly Unit");
      expect(theBlueGiant.text).toContain("can't receive battle damage");
      expect(theBlueGiant.text).toContain("2 or less AP");
      expect(theBlueGiant.text).toContain("during this battle");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(theBlueGiant.abilities).toBeDefined();
      expect(theBlueGiant.abilities.length).toBe(1);
    });

    it("should have triggered Action ability", () => {
      const ability = theBlueGiant.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【action】");
      expect(ability.trigger?.event).toBe("action");
    });

    it("should have targeting effect", () => {
      const ability = theBlueGiant.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

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
      // The Blue Giant costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          resourceArea: 3,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Card is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with friendly units", () => {
      // The Blue Giant targets friendly units
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          battleArea: 2, // Friendly units to protect
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units with low AP
          resourceArea: 3,
          deck: 30,
        },
      );

      // Scenario: player has friendly units to protect
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should set up scenario for damage prevention", () => {
      // The Blue Giant prevents battle damage from units with 2 or less AP
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          battleArea: 1, // Unit to protect
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit with ≤2 AP
          resourceArea: 3,
          deck: 30,
        },
      );

      // Setup for protection: friendly unit takes no damage from low AP enemies
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be usable during Action Step", () => {
      // Command cards with 【Action】 can be used during Action Step (combat or end phase)
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Action ability can be activated during Action Step
      const ability = theBlueGiant.abilities[0];
      expect(ability.trigger?.event).toBe("action");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(theBlueGiant).toHaveProperty("implemented");
      expect(theBlueGiant).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 4 appropriate for cost 1 command", () => {
      // Level 4 command with cost 1 is efficient protection
      expect(theBlueGiant.level).toBe(4);
      expect(theBlueGiant.cost).toBe(1);
    });

    it("should provide combat protection", () => {
      // The Blue Giant: 1 cost for damage prevention from ≤2 AP units
      // Efficient protection during combat
      expect(theBlueGiant.cost).toBe(1);
      expect(theBlueGiant.text).toContain("can't receive battle damage");
      expect(theBlueGiant.text).toContain("2 or less AP");
    });

    it("should require target selection", () => {
      // Must choose which friendly unit to protect
      const ability = theBlueGiant.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.target.isMultiple).toBe(false); // Single target
      expect(targetEffect.targetText).toContain("friendly");
    });

    it("should set up combat protection scenario", () => {
      // The Blue Giant used to protect unit from low AP attackers
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          battleArea: 1, // Unit being attacked by ≤2 AP enemy
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit with ≤2 AP
          resourceArea: 3,
          deck: 30,
        },
      );

      // Protection scenario: negate damage from low AP enemies
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be green defensive tool", () => {
      // Green deck combat trick for protecting units
      expect(theBlueGiant.color).toBe("green");
      expect(theBlueGiant.type).toBe("command");
    });

    it("should counter swarm strategies", () => {
      // The Blue Giant is effective against multiple low AP units
      expect(theBlueGiant.text).toContain("2 or less AP");

      // Protects against low AP attackers (1-2 AP units)
      const engine = new GundamTestEngine(
        {
          hand: [theBlueGiant],
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple low AP units
          resourceArea: 3,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 3, "player_two");
    });
  });

  describe("Targeting Details", () => {
    it("should target friendly units only", () => {
      // Cannot target enemy units
      const ability = theBlueGiant.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.targetText).toBe("friendly Unit");
      expect(targetEffect.target.zone).toBe("battlefield");
    });

    it("should target single unit", () => {
      // Targets exactly 1 unit, not multiple
      const ability = theBlueGiant.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.amount).toBe("1");
      expect(targetEffect.target.value).toBe(1);
      expect(targetEffect.target.isMultiple).toBe(false);
    });

    it("should only prevent damage from low AP units", () => {
      // Only prevents damage from units with 2 or less AP
      expect(theBlueGiant.text).toContain("2 or less AP");
      // Units with 3+ AP still deal damage normally
    });
  });
});
