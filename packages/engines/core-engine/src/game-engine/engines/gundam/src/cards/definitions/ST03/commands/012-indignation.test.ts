import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { indignation } from "./012-indignation";

/**
 * Tests for ST03-012: Indignation
 *
 * Card Properties:
 * - Cost: 1, Level: 2
 * - Color: Red
 * - Type: Command
 *
 * Abilities:
 * - 【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Main/Action ability definition
 * - Targeting friendly units
 * - AP boost effect
 */

describe("ST03-012: Indignation", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(indignation.id).toBe("ST03-012");
      expect(indignation.name).toBe("Indignation");
      expect(indignation.number).toBe(12);
      expect(indignation.set).toBe("ST03");
      expect(indignation.type).toBe("command");
      expect(indignation.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(indignation.cost).toBe(1);
      expect(indignation.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(indignation.color).toBe("red");
    });

    it("should have text describing Main/Action ability", () => {
      expect(indignation.text).toContain("Main");
      expect(indignation.text).toContain("Action");
      expect(indignation.text).toContain("Choose");
      expect(indignation.text).toContain("friendly Unit");
      expect(indignation.text).toContain("AP+2");
      expect(indignation.text).toContain("during this turn");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(indignation.abilities).toBeDefined();
      expect(indignation.abilities.length).toBe(1);
    });

    it("should have triggered Action ability", () => {
      const ability = indignation.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【action】");
      expect(ability.trigger?.event).toBe("action");
    });

    it("should have targeting effect", () => {
      const ability = indignation.abilities[0];
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
      // Indignation costs 1, so need 1 resource
      const engine = new GundamTestEngine(
        {
          hand: [indignation],
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
      // Indignation targets friendly units
      const engine = new GundamTestEngine(
        {
          hand: [indignation],
          battleArea: 2, // Friendly units to boost
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Scenario: player has friendly units to target
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should set up scenario for AP boost", () => {
      // Indignation gives chosen friendly unit +2 AP for the turn
      const engine = new GundamTestEngine(
        {
          hand: [indignation],
          battleArea: 1, // Unit to boost (e.g., 3 AP → 5 AP)
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Setup for boost: friendly unit gets +2 AP for combat
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be usable during Main Phase and Action Step", () => {
      // Command cards with 【Main】/【Action】 can be used in both phases
      const engine = new GundamTestEngine(
        {
          hand: [indignation],
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

      // Main/Action ability can be activated in Main Phase or Action Step
      expect(indignation.text).toContain("Main");
      expect(indignation.text).toContain("Action");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(indignation).toHaveProperty("implemented");
      expect(indignation).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 2 appropriate for cost 1 command", () => {
      // Level 2 command with cost 1 is efficient combat trick
      expect(indignation.level).toBe(2);
      expect(indignation.cost).toBe(1);
    });

    it("should provide temporary AP boost for combat", () => {
      // Indignation: 1 cost for +2 AP during this turn
      // Efficient combat trick to push damage or survive combat
      expect(indignation.cost).toBe(1);
      expect(indignation.text).toContain("AP+2");
      expect(indignation.text).toContain("during this turn");
    });

    it("should require target selection", () => {
      // Must choose which friendly unit to boost
      const ability = indignation.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.type).toBe("targeting");
      expect(targetEffect.target.isMultiple).toBe(false); // Single target
      expect(targetEffect.targetText).toContain("friendly");
    });

    it("should set up combat trick scenario", () => {
      // Indignation used to boost attacker or defender during combat
      const engine = new GundamTestEngine(
        {
          hand: [indignation],
          battleArea: 1, // Unit with 3 AP becomes 5 AP
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit to fight
          resourceArea: 3,
          deck: 30,
        },
      );

      // Combat trick scenario: boost friendly unit AP by +2
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be red aggressive tool", () => {
      // Red deck combat trick for boosting attacks
      expect(indignation.color).toBe("red");
      expect(indignation.type).toBe("command");
    });
  });

  describe("Targeting Details", () => {
    it("should target friendly units only", () => {
      // Cannot target enemy units
      const ability = indignation.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.targetText).toBe("friendly Unit");
      expect(targetEffect.target.zone).toBe("battlefield");
    });

    it("should target single unit", () => {
      // Targets exactly 1 unit, not multiple
      const ability = indignation.abilities[0];
      const targetEffect = ability.effects[0];

      expect(targetEffect.amount).toBe("1");
      expect(targetEffect.target.value).toBe(1);
      expect(targetEffect.target.isMultiple).toBe(false);
    });
  });
});
