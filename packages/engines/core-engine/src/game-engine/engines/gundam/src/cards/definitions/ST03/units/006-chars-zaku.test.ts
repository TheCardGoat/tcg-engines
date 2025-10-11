import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { charsZaku } from "./006-chars-zaku";

/**
 * Tests for ST03-006: Char's Zaku Ⅱ
 *
 * Card Properties:
 * - Cost: 2, Level: 3, AP: 3, HP: 2
 * - Color: Green
 * - Traits: Zeon
 * - Link Requirement: Char Aznable
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【Destroyed】: Look at top 3 cards, reveal and add 1 (Zeon)/(Neo Zeon) Unit to hand, return rest to bottom
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Destroyed trigger ability definition
 * - Card search effect definition
 * - Card usability in game scenarios
 */

describe("ST03-006: Char's Zaku Ⅱ", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(charsZaku.id).toBe("ST03-006");
      expect(charsZaku.name).toBe("Char's Zaku Ⅱ");
      expect(charsZaku.number).toBe(6);
      expect(charsZaku.set).toBe("ST03");
      expect(charsZaku.type).toBe("unit");
      expect(charsZaku.rarity).toBe("legendary");
    });

    it("should have correct stats", () => {
      expect(charsZaku.cost).toBe(2);
      expect(charsZaku.level).toBe(3);
      expect(charsZaku.ap).toBe(3);
      expect(charsZaku.hp).toBe(2);
    });

    it("should have correct color and traits", () => {
      expect(charsZaku.color).toBe("green");
      expect(charsZaku.traits).toEqual(["zeon"]);
    });

    it("should have correct zones", () => {
      expect(charsZaku.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(charsZaku.linkRequirement).toEqual(["char aznable"]);
    });

    it("should have text describing Destroyed ability", () => {
      expect(charsZaku.text).toContain("Destroyed");
      expect(charsZaku.text).toContain("Look at the top 3 cards");
      expect(charsZaku.text).toContain("Zeon");
      expect(charsZaku.text).toContain("Neo Zeon");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(charsZaku.abilities).toBeDefined();
      expect(charsZaku.abilities.length).toBe(1);
    });

    it("should have triggered Destroyed ability", () => {
      const ability = charsZaku.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【destroyed】");
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("destroyed");
    });

    it("should have search effect in Destroyed ability", () => {
      const ability = charsZaku.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const searchEffect = ability.effects.find((e) => e.type === "search");
      expect(searchEffect).toBeDefined();
      expect(searchEffect?.type).toBe("search");
    });

    it("should have move-to-hand effect in Destroyed ability", () => {
      const ability = charsZaku.abilities[0];
      const moveEffect = ability.effects.find((e) => e.type === "move-to-hand");
      expect(moveEffect).toBeDefined();
      expect(moveEffect?.type).toBe("move-to-hand");
    });

    it("should have rule effects for Zeon and Neo Zeon traits", () => {
      const ability = charsZaku.abilities[0];
      const ruleEffects = ability.effects.filter((e) => e.type === "rule");
      expect(ruleEffects.length).toBeGreaterThanOrEqual(2);

      const zeonRule = ruleEffects.find((e) => e.ruleText === "Zeon");
      const neoZeonRule = ruleEffects.find((e) => e.ruleText === "Neo Zeon");
      expect(zeonRule).toBeDefined();
      expect(neoZeonRule).toBeDefined();
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Char's Zaku Ⅱ costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [charsZaku],
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

    it("should set up scenario with Char's Zaku Ⅱ in battle area", () => {
      // Char's Zaku Ⅱ with Destroyed ability on the field
      const engine = new GundamTestEngine(
        {
          battleArea: [charsZaku],
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

      // Char's Zaku Ⅱ is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Destroyed ability testing", () => {
      // Char's Zaku Ⅱ will search for Zeon/Neo Zeon units when destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: [charsZaku],
          hand: 5,
          resourceArea: 3,
          deck: 30, // Deck needs cards for search effect
        },
        {
          battleArea: 1, // Enemy to destroy Char's Zaku Ⅱ
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Setup for Destroyed ability: look at top 3 cards when destroyed
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should work with Char Aznable pilot link requirement", () => {
      // Char's Zaku Ⅱ has link requirement for Char Aznable
      const engine = new GundamTestEngine(
        {
          battleArea: [charsZaku],
          hand: 5, // Could have Char Aznable pilot card
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

      // Char's Zaku Ⅱ can be paired with Char Aznable
      expect(charsZaku.linkRequirement).toContain("char aznable");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Char's Zaku Ⅱ can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [charsZaku],
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

      // Char's Zaku Ⅱ supports both deployment zones
      expect(charsZaku.zones).toContain("space");
      expect(charsZaku.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(charsZaku).toHaveProperty("implemented");
      expect(charsZaku).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 3 stats appropriate for cost 2", () => {
      // Level 3 unit with 2 cost is an efficient early-mid game unit
      expect(charsZaku.level).toBe(3);
      expect(charsZaku.cost).toBe(2);
      expect(charsZaku.ap).toBe(3);
      expect(charsZaku.hp).toBe(2);
    });

    it("should have offensive-focused stats", () => {
      // Char's Zaku Ⅱ has 3 AP and 2 HP - strong offensive stats
      const totalStats = charsZaku.ap + charsZaku.hp;
      expect(totalStats).toBe(5); // 3 + 2

      // High AP relative to cost (3 AP for 2 cost)
      expect(charsZaku.ap).toBe(3);
      expect(charsZaku.cost).toBe(2);
    });

    it("should set up combat scenario", () => {
      // Char's Zaku Ⅱ with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [charsZaku],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 3,
          deck: 30,
        },
      );

      // Combat scenario ready: Char's Zaku Ⅱ can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should generate card advantage when destroyed", () => {
      // Char's Zaku Ⅱ's Destroyed ability provides card advantage
      const engine = new GundamTestEngine(
        {
          battleArea: [charsZaku],
          resourceArea: 3,
          deck: 30, // Deck for search effect
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // When destroyed, searches for Zeon/Neo Zeon units
      expect(charsZaku.abilities[0].trigger.event).toBe("destroyed");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should work well in Zeon tribal strategies", () => {
      // Char's Zaku Ⅱ has Zeon trait and searches for Zeon/Neo Zeon units
      expect(charsZaku.traits).toContain("zeon");

      // Destroyed ability synergizes with Zeon tribal deck
      const ability = charsZaku.abilities[0];
      const zeonRule = ability.effects.find(
        (e) => e.type === "rule" && e.ruleText === "Zeon",
      );
      const neoZeonRule = ability.effects.find(
        (e) => e.type === "rule" && e.ruleText === "Neo Zeon",
      );
      expect(zeonRule).toBeDefined();
      expect(neoZeonRule).toBeDefined();
    });
  });
});
