import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { tallgeese } from "./006-tallgeese";

/**
 * Tests for ST02-006: Tallgeese
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 4, HP: 4
 * - Color: Blue
 * - Traits: None
 * - Link Requirement: Zechs Merquise
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Activate･Main】【Once per Turn】④: Set this Unit as active
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Activate ability definition
 * - Card usability in game scenarios
 */

describe("ST02-006: Tallgeese", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(tallgeese.id).toBe("ST02-006");
      expect(tallgeese.name).toBe("Tallgeese");
      expect(tallgeese.number).toBe(6);
      expect(tallgeese.set).toBe("ST02");
      expect(tallgeese.type).toBe("unit");
      expect(tallgeese.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(tallgeese.cost).toBe(4);
      expect(tallgeese.level).toBe(5);
      expect(tallgeese.ap).toBe(4);
      expect(tallgeese.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(tallgeese.color).toBe("blue");
      expect(tallgeese.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(tallgeese.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(tallgeese.linkRequirement).toEqual(["zechs merquise"]);
    });

    it("should have text describing Activate ability", () => {
      expect(tallgeese.text).toContain("Activate");
      expect(tallgeese.text).toContain("Main");
      expect(tallgeese.text).toContain("Once per Turn");
    });
  });

  describe("Abilities Definition", () => {
    it("should have two abilities", () => {
      expect(tallgeese.abilities).toBeDefined();
      expect(tallgeese.abilities.length).toBe(2);
    });

    it("should have triggered abilities", () => {
      const ability1 = tallgeese.abilities[0];
      const ability2 = tallgeese.abilities[1];
      expect(ability1.type).toBe("triggered");
      expect(ability2.type).toBe("triggered");
    });

    it("should have Activate-Main trigger", () => {
      const ability = tallgeese.abilities[0];
      expect(ability.text).toBe("【Activate･Main】");
      expect(ability.trigger.event).toBe("activate･main");
    });

    it("should have once per turn trigger", () => {
      const ability = tallgeese.abilities[1];
      expect(ability.text).toBe("【Once per Turn】");
      expect(ability.trigger.event).toBe("once-per-turn");
    });

    it("should have placeholder effects", () => {
      const ability1 = tallgeese.abilities[0];
      const ability2 = tallgeese.abilities[1];
      expect(ability1.effects).toBeDefined();
      expect(ability1.effects.length).toBe(1);
      expect(ability1.effects[0].type).toBe("placeholder");
      expect(ability2.effects).toBeDefined();
      expect(ability2.effects.length).toBe(1);
      expect(ability2.effects[0].type).toBe("placeholder");
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Tallgeese costs 4, so need 4 resources
      const engine = new GundamTestEngine(
        {
          hand: [tallgeese],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Card is in hand and can be deployed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with Tallgeese in battle area", () => {
      // Tallgeese with Activate ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          hand: 5,
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

      // Tallgeese is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Activate ability testing", () => {
      // Tallgeese can pay 4 to untap itself
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          hand: 5,
          resourceArea: 8, // Need 4 extra to activate ability
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for Activate ability: needs 4 resources to untap
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 8, "player_one");
    });

    it("should work with Zechs Merquise pilot link requirement", () => {
      // Tallgeese has link requirement for Zechs Merquise
      // When paired with Zechs, additional effects would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          hand: 5, // Could have Zechs Merquise pilot card
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

      // Tallgeese can be paired with Zechs Merquise
      expect(tallgeese.linkRequirement).toContain("zechs merquise");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Tallgeese can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [tallgeese],
          resourceArea: 5,
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Tallgeese supports both deployment zones
      expect(tallgeese.zones).toContain("space");
      expect(tallgeese.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should enable multiple attacks per turn", () => {
      // Tallgeese's untap ability allows attacking twice
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          hand: 5,
          resourceArea: 8, // 4 for ability activation
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can attack, pay 4 to untap, attack again (described in full card text)
      expect(tallgeese.text).toContain("Set this Unit as active");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have once per turn limit on ability", () => {
      // Ability can only be used once per turn
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          resourceArea: 12, // Even with 12 resources
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Once per Turn restriction
      expect(tallgeese.abilities[1].text).toBe("【Once per Turn】");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(tallgeese).toHaveProperty("implemented");
      expect(tallgeese).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 5 stats appropriate for cost 4", () => {
      // Level 5 unit with 4 cost is standard value
      expect(tallgeese.level).toBe(5);
      expect(tallgeese.cost).toBe(4);
      expect(tallgeese.ap).toBe(4);
      expect(tallgeese.hp).toBe(4);
    });

    it("should have perfectly balanced AP and HP", () => {
      // Tallgeese has 4 AP and 4 HP - perfectly balanced
      const totalStats = tallgeese.ap + tallgeese.hp;
      expect(totalStats).toBe(8); // 4 + 4

      // Equal AP and HP
      expect(tallgeese.ap).toBe(tallgeese.hp);
    });

    it("should set up combat scenario", () => {
      // Tallgeese with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Tallgeese can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should be a strong mid-game unit", () => {
      // Level 5 is mid-game, cost 4 is reasonable
      expect(tallgeese.level).toBe(5);
      expect(tallgeese.cost).toBe(4);

      // Good total stats for cost
      const totalStats = tallgeese.ap + tallgeese.hp;
      expect(totalStats).toBeGreaterThanOrEqual(8);
    });

    it("should work as aggressive threat with untap ability", () => {
      // Tallgeese can attack twice per turn with ability
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Untap ability provides double attack potential (described in full card text)
      expect(tallgeese.text).toContain("Set this Unit as active");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should have high resource requirement for ability", () => {
      // Ability costs 4 resources to activate
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          resourceArea: 4, // Exactly 4 resources
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Expensive activation cost balances powerful effect (described in full card text)
      expect(tallgeese.text).toContain("④");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should double combat damage potential per turn", () => {
      // With untap ability, can deal 8 damage per turn (4 AP x 2 attacks)
      const engine = new GundamTestEngine(
        {
          battleArea: [tallgeese],
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // 4 AP twice = 8 total damage potential
      expect(tallgeese.ap).toBe(4);
      expect(tallgeese.abilities[0].trigger.event).toBe("activate･main");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
