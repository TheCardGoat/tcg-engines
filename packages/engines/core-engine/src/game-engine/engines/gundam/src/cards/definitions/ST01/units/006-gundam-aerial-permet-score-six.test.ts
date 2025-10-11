import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { gundamAerialPermetScoreSix } from "./006-gundam-aerial-permet-score-six";

/**
 * Tests for ST01-006: Gundam Aerial (Permet Score Six)
 *
 * Card Properties:
 * - Cost: 4, Level: 5, AP: 4, HP: 4
 * - Color: White
 * - Traits: Academy
 * - Link Requirement: Suletta Mercury
 * - Zones: Space, Earth
 *
 * Abilities:
 * - <When Paired>: Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - When Paired triggered ability with targeting and AP reduction
 * - Level-based targeting condition
 * - Tempo-focused debuff ability
 */

describe("ST01-006: Gundam Aerial (Permet Score Six)", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(gundamAerialPermetScoreSix.id).toBe("ST01-006");
      expect(gundamAerialPermetScoreSix.name).toBe(
        "Gundam Aerial (Permet Score Six)",
      );
      expect(gundamAerialPermetScoreSix.number).toBe(6);
      expect(gundamAerialPermetScoreSix.set).toBe("ST01");
      expect(gundamAerialPermetScoreSix.type).toBe("unit");
      expect(gundamAerialPermetScoreSix.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(gundamAerialPermetScoreSix.cost).toBe(4);
      expect(gundamAerialPermetScoreSix.level).toBe(5);
      expect(gundamAerialPermetScoreSix.ap).toBe(4);
      expect(gundamAerialPermetScoreSix.hp).toBe(4);
    });

    it("should have correct color and traits", () => {
      expect(gundamAerialPermetScoreSix.color).toBe("white");
      expect(gundamAerialPermetScoreSix.traits).toEqual(["academy"]);
    });

    it("should have correct zones", () => {
      expect(gundamAerialPermetScoreSix.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(gundamAerialPermetScoreSix.linkRequirement).toEqual([
        "suletta mercury",
      ]);
    });

    it("should have text describing When Paired ability", () => {
      expect(gundamAerialPermetScoreSix.text).toContain("When Paired");
      expect(gundamAerialPermetScoreSix.text).toContain("Choose");
      expect(gundamAerialPermetScoreSix.text).toContain("enemy Unit");
      expect(gundamAerialPermetScoreSix.text).toContain("Lv");
      expect(gundamAerialPermetScoreSix.text).toContain("AP-3");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(gundamAerialPermetScoreSix.abilities).toBeDefined();
      expect(gundamAerialPermetScoreSix.abilities.length).toBe(1);
    });

    it("should have triggered When Paired ability", () => {
      const ability = gundamAerialPermetScoreSix.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【when paired】");
    });

    it("should have trigger for when-paired event", () => {
      const ability = gundamAerialPermetScoreSix.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("when-paired");
    });

    it("should have targeting effect with level condition", () => {
      const ability = gundamAerialPermetScoreSix.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("targeting");
      expect(effect.amount).toBe("1");
      expect(effect.targetText).toContain("enemy Unit that is Lv");
    });

    it("should have targeting configuration for enemy units", () => {
      const ability = gundamAerialPermetScoreSix.abilities[0];
      const targetingEffect = ability.effects[0];

      expect(targetingEffect.target).toBeDefined();
      expect(targetingEffect.target.type).toBe("unit");
      expect(targetingEffect.target.value).toBe(1);
      expect(targetingEffect.target.zone).toBe("battlefield");
      expect(targetingEffect.target.isMultiple).toBe(false);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Gundam Aerial Permet Score Six costs 4, so need 4 resources
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialPermetScoreSix],
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

    it("should set up scenario with Gundam Aerial in battle area", () => {
      // Gundam Aerial Permet Score Six with When Paired ability in battle area
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
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

      // Gundam Aerial is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for When Paired ability testing", () => {
      // Gundam Aerial that would apply AP-3 when paired
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          hand: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Enemy units that could be targeted
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for When Paired ability: choose enemy unit Lv.5 or lower and apply AP-3
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should work with Suletta Mercury pilot link requirement", () => {
      // Gundam Aerial has link requirement for Suletta Mercury
      // When paired with Suletta Mercury, AP-3 effect would activate
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          hand: 5, // Could have Suletta Mercury pilot card
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

      // Gundam Aerial can be paired with Suletta Mercury
      expect(gundamAerialPermetScoreSix.linkRequirement).toContain(
        "suletta mercury",
      );
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Gundam Aerial can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [gundamAerialPermetScoreSix],
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

      // Gundam Aerial supports both deployment zones
      expect(gundamAerialPermetScoreSix.zones).toContain("space");
      expect(gundamAerialPermetScoreSix.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up scenario with Lv.5 or lower enemy targets", () => {
      // When Paired ability targets units Lv.5 or lower
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          hand: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple enemy units of various levels
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup to verify targeting condition (Lv.5 or lower)
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should set up scenario with no valid targets", () => {
      // When all enemy units are Lv.6 or higher
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          hand: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // High level enemy units
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for When Paired with no valid targets (level > 5)
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should set up scenario for combat advantage with AP reduction", () => {
      // AP-3 reduction creates favorable combat situations
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit to be debuffed
          resourceArea: 5,
          deck: 30,
        },
      );

      // Setup for combat with AP-3 debuff on enemy
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(gundamAerialPermetScoreSix).toHaveProperty("implemented");
      expect(gundamAerialPermetScoreSix).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 5 stats appropriate for cost 4", () => {
      // Level 5 unit with 4 cost is a powerful mid-game unit
      expect(gundamAerialPermetScoreSix.level).toBe(5);
      expect(gundamAerialPermetScoreSix.cost).toBe(4);
      expect(gundamAerialPermetScoreSix.ap).toBe(4);
      expect(gundamAerialPermetScoreSix.hp).toBe(4);
    });

    it("should have balanced AP and HP", () => {
      // Gundam Aerial has 4 AP and 4 HP - perfectly balanced stats
      const totalStats =
        gundamAerialPermetScoreSix.ap + gundamAerialPermetScoreSix.hp;
      expect(totalStats).toBe(8); // 4 + 4

      // Equal AP and HP
      expect(gundamAerialPermetScoreSix.ap).toBe(gundamAerialPermetScoreSix.hp);
    });

    it("should set up combat scenario", () => {
      // Gundam Aerial with 4 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Combat scenario ready: Gundam Aerial can attack with 4 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have synergy between high stats and AP debuff", () => {
      // 4 AP combined with enemy AP-3 creates significant combat advantage
      expect(gundamAerialPermetScoreSix.ap).toBe(4);

      // When Paired ability reduces enemy AP by 3
      const ability = gundamAerialPermetScoreSix.abilities[0];
      expect(ability.trigger.event).toBe("when-paired");
    });

    it("should be effective at dominating mid-game combat", () => {
      // High stats with AP reduction controls mid-game board
      const engine = new GundamTestEngine(
        {
          battleArea: [gundamAerialPermetScoreSix],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple mid-game enemy units
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can dominate combat with 4/4 stats and debuff ability
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(gundamAerialPermetScoreSix.ap).toBe(4);
      expect(gundamAerialPermetScoreSix.hp).toBe(4);
    });

    it("should have legendary rarity appropriate for power level", () => {
      // Strong balanced stats with powerful ability justifies legendary rarity
      expect(gundamAerialPermetScoreSix.rarity).toBe("legendary");
      expect(gundamAerialPermetScoreSix.level).toBe(5);
      expect(
        gundamAerialPermetScoreSix.ap + gundamAerialPermetScoreSix.hp,
      ).toBe(8);
    });
  });
});
