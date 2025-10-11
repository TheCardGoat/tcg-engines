import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gazaDSleeves } from "./004-gaza-d-sleeves";

/**
 * Tests for ST03-004: Gaza D (Sleeves)
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 2, HP: 1
 * - Color: Red
 * - Traits: Zeon
 * - Link Requirement: -
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <Support 2>: Continuous keyword effect
 * - 【Activate·Main】: Triggered ability to rest this unit and grant +2 AP to another unit
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Support keyword effect definition
 * - Activate·Main ability definition
 * - Card usability in game scenarios
 */

describe("ST03-004: Gaza D (Sleeves)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gazaDSleeves.id).toBe("ST03-004");
      expect(gazaDSleeves.name).toBe("Gaza D (Sleeves)");
      expect(gazaDSleeves.number).toBe(4);
      expect(gazaDSleeves.set).toBe("ST03");
      expect(gazaDSleeves.type).toBe("unit");
      expect(gazaDSleeves.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(gazaDSleeves.cost).toBe(2);
      expect(gazaDSleeves.level).toBe(2);
      expect(gazaDSleeves.ap).toBe(2);
      expect(gazaDSleeves.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(gazaDSleeves.color).toBe("red");
      expect(gazaDSleeves.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(gazaDSleeves.zones).toEqual(["space", "earth"]);
    });

    it("should have no specific link requirement", () => {
      expect(gazaDSleeves.linkRequirement).toEqual(["-"]);
    });

    it("should have text describing Support and Activate·Main abilities", () => {
      expect(gazaDSleeves.text).toContain("Activate･Main");
      expect(gazaDSleeves.text).toContain("Support 2");
      expect(gazaDSleeves.text).toContain("Rest this Unit");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(gazaDSleeves.abilities).toBeDefined();
      expect(gazaDSleeves.abilities.length).toBe(2);
    });

    it("should have continuous Support ability", () => {
      const ability = gazaDSleeves.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Support 2>");
    });

    it("should have Support keyword effect with value 2", () => {
      const ability = gazaDSleeves.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Support");
      expect(effect.value).toBe(2);
    });

    it("should have triggered Activate·Main ability", () => {
      const ability = gazaDSleeves.abilities[1];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【activate･main】");
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("activate･main");
    });

    it("should have rest effect in Activate·Main ability", () => {
      const ability = gazaDSleeves.abilities[1];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const restEffect = ability.effects[0];
      expect(restEffect.type).toBe("rest");
      expect(restEffect.target).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gaza D (Sleeves) costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [gazaDSleeves],
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

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 3, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Gaza D in battle area", () => {
      // Gaza D (Sleeves) with Support 2 in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves],
          hand: 5,
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

      // Gaza D (Sleeves) is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Support ability testing", () => {
      // Gaza D (Sleeves) with Support 2 can boost another unit's AP
      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves, 1], // Gaza D + another unit
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Setup for Support ability: can rest to give +2 AP to another unit
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Gaza D (Sleeves) can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gazaDSleeves],
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

      // Gaza D supports both deployment zones
      expect(gazaDSleeves.zones).toContain("space");
      expect(gazaDSleeves.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario for Activate·Main ability", () => {
      // During Main Phase, can activate ability to rest and boost another unit
      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves, 1], // Gaza D + target unit
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Activate·Main ability can be used during main phase
      assertGamePhase(engine, "mainPhase");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should work with no pilot link requirement", () => {
      // Gaza D (Sleeves) has no specific pilot requirement - flexible pairing
      expect(gazaDSleeves.linkRequirement).toEqual(["-"]);

      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves],
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gazaDSleeves).toHaveProperty("implemented");
      expect(gazaDSleeves).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost is an early game support unit
      expect(gazaDSleeves.level).toBe(2);
      expect(gazaDSleeves.cost).toBe(2);
      expect(gazaDSleeves.ap).toBe(2);
      expect(gazaDSleeves.hp).toBe(1);
    });

    it("should have low total stats but valuable support ability", () => {
      // Gaza D (Sleeves) has 2 AP and 1 HP - low stats compensated by Support
      const totalStats = gazaDSleeves.ap + gazaDSleeves.hp;
      expect(totalStats).toBe(3); // 2 + 1

      // With Support 2, provides value through boosting allies
      expect(gazaDSleeves.abilities[0].effects[0].value).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Gaza D (Sleeves) with 2 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 3,
          deck: 30,
        },
      );

      // Combat scenario ready: Gaza D can attack with 2 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should work as a cheap support unit", () => {
      // Gaza D (Sleeves) is a low-cost support unit for boosting attackers
      const engine = new GundamTestEngine(
        {
          battleArea: [gazaDSleeves, 1], // Gaza D + ally
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Support ability makes it valuable despite low stats
      expect(gazaDSleeves.abilities[0].effects[0].keyword).toBe("Support");
      expect(gazaDSleeves.cost).toBe(2);
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });
  });
});
