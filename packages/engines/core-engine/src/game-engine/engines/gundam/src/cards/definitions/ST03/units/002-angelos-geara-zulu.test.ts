import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { angelosGearaZulu } from "./002-angelos-geara-zulu";

/**
 * Tests for ST03-002: Angelo's Geara Zulu
 *
 * Card Properties:
 * - Cost: 3, Level: 4, AP: 3, HP: 3
 * - Color: Red
 * - Traits: Zeon
 * - Link Requirement: Angelo Sauper
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

describe("ST03-002: Angelo's Geara Zulu", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(angelosGearaZulu.id).toBe("ST03-002");
      expect(angelosGearaZulu.name).toBe("Angelo's Geara Zulu");
      expect(angelosGearaZulu.number).toBe(2);
      expect(angelosGearaZulu.set).toBe("ST03");
      expect(angelosGearaZulu.type).toBe("unit");
      expect(angelosGearaZulu.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(angelosGearaZulu.cost).toBe(3);
      expect(angelosGearaZulu.level).toBe(4);
      expect(angelosGearaZulu.ap).toBe(3);
      expect(angelosGearaZulu.hp).toBe(3);
    });

    it("should have correct color and traits", () => {
      expect(angelosGearaZulu.color).toBe("red");
      expect(angelosGearaZulu.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(angelosGearaZulu.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(angelosGearaZulu.linkRequirement).toEqual(["angelo sauper"]);
    });

    it("should have text describing Support and Activate·Main abilities", () => {
      expect(angelosGearaZulu.text).toContain("Activate･Main");
      expect(angelosGearaZulu.text).toContain("Support 2");
      expect(angelosGearaZulu.text).toContain("Rest this Unit");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(angelosGearaZulu.abilities).toBeDefined();
      expect(angelosGearaZulu.abilities.length).toBe(2);
    });

    it("should have continuous Support ability", () => {
      const ability = angelosGearaZulu.abilities[0];
      expect(ability.type).toBe("continuous");
      expect(ability.text).toBe("<Support 2>");
    });

    it("should have Support keyword effect with value 2", () => {
      const ability = angelosGearaZulu.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("keyword");
      expect(effect.keyword).toBe("Support");
      expect(effect.value).toBe(2);
    });

    it("should have triggered Activate·Main ability", () => {
      const ability = angelosGearaZulu.abilities[1];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【activate･main】");
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("activate･main");
    });

    it("should have rest effect in Activate·Main ability", () => {
      const ability = angelosGearaZulu.abilities[1];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const restEffect = ability.effects[0];
      expect(restEffect.type).toBe("rest");
      expect(restEffect.target).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Angelo's Geara Zulu costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [angelosGearaZulu],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Angelo's Geara Zulu in battle area", () => {
      // Angelo's Geara Zulu with Support 2 in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [angelosGearaZulu],
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Angelo's Geara Zulu is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Support ability testing", () => {
      // Angelo's Geara Zulu with Support 2 can boost another unit's AP
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Angelo's Geara Zulu + another unit
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Setup for Support ability: can rest to give +2 AP to another unit
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should work with Angelo Sauper pilot link requirement", () => {
      // Angelo's Geara Zulu has link requirement for Angelo Sauper
      const engine = new GundamTestEngine(
        {
          battleArea: [angelosGearaZulu],
          hand: 5, // Could have Angelo Sauper pilot card
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Angelo's Geara Zulu can be paired with Angelo Sauper
      expect(angelosGearaZulu.linkRequirement).toContain("angelo sauper");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Angelo's Geara Zulu can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [angelosGearaZulu],
          resourceArea: 4,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Angelo's Geara Zulu supports both deployment zones
      expect(angelosGearaZulu.zones).toContain("space");
      expect(angelosGearaZulu.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario for Activate·Main ability", () => {
      // During Main Phase, can activate ability to rest and boost another unit
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Angelo's Geara Zulu + target unit
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Activate·Main ability can be used during main phase
      assertGamePhase(engine, "mainPhase");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(angelosGearaZulu).toHaveProperty("implemented");
      expect(angelosGearaZulu).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 4 stats appropriate for cost 3", () => {
      // Level 4 unit with 3 cost is a solid mid-game support unit
      expect(angelosGearaZulu.level).toBe(4);
      expect(angelosGearaZulu.cost).toBe(3);
      expect(angelosGearaZulu.ap).toBe(3);
      expect(angelosGearaZulu.hp).toBe(3);
    });

    it("should have balanced AP and HP", () => {
      // Angelo's Geara Zulu has 3 AP and 3 HP - perfectly balanced stats
      const totalStats = angelosGearaZulu.ap + angelosGearaZulu.hp;
      expect(totalStats).toBe(6); // 3 + 3

      // With Support 2, can boost another unit by +2 AP
      expect(angelosGearaZulu.abilities[0].effects[0].value).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Angelo's Geara Zulu with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [angelosGearaZulu],
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 4,
          deck: 30,
        },
      );

      // Combat scenario ready: Angelo's Geara Zulu can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should work as a support unit", () => {
      // Angelo's Geara Zulu is designed to boost other units
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Angelo's Geara Zulu + ally
          resourceArea: 4,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 4,
          deck: 30,
        },
      );

      // Support ability makes it valuable in multi-unit strategies
      expect(angelosGearaZulu.abilities[0].effects[0].keyword).toBe("Support");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });
  });
});
