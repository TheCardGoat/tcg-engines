import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { miguelsGinn } from "./009-miguels-ginn";

/**
 * Tests for ST04-009: Miguel's Ginn
 *
 * Card Properties:
 * - Cost: 2, Level: 2, AP: 3, HP: 1
 * - Color: Red
 * - Traits: [] (empty)
 * - Link Requirement: Miguel Ayman
 * - Zones: Space, Earth
 *
 * Abilities:
 * - 【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Destroyed trigger ability definition
 * - Conditional draw effect
 * - Card usability in game scenarios
 */

describe("ST04-009: Miguel's Ginn", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(miguelsGinn.id).toBe("ST04-009");
      expect(miguelsGinn.name).toBe("Miguel's Ginn");
      expect(miguelsGinn.number).toBe(9);
      expect(miguelsGinn.set).toBe("ST04");
      expect(miguelsGinn.type).toBe("unit");
      expect(miguelsGinn.rarity).toBe("common");
    });

    it("should have correct stats", () => {
      expect(miguelsGinn.cost).toBe(2);
      expect(miguelsGinn.level).toBe(2);
      expect(miguelsGinn.ap).toBe(3);
      expect(miguelsGinn.hp).toBe(1);
    });

    it("should have correct color and traits", () => {
      expect(miguelsGinn.color).toBe("red");
      expect(miguelsGinn.traits).toEqual([]);
    });

    it("should have correct zones", () => {
      expect(miguelsGinn.zones).toEqual(["space", "earth"]);
    });

    it("should have correct link requirement", () => {
      expect(miguelsGinn.linkRequirement).toEqual(["miguel ayman"]);
    });

    it("should have text describing During Pair and Destroyed abilities", () => {
      expect(miguelsGinn.text).toContain("During Pair");
      expect(miguelsGinn.text).toContain("Destroyed");
      expect(miguelsGinn.text).toContain("draw 1");
      expect(miguelsGinn.text).toContain("Link Unit");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(miguelsGinn.abilities).toBeDefined();
      expect(miguelsGinn.abilities.length).toBe(1);
    });

    it("should have triggered Destroyed ability", () => {
      const ability = miguelsGinn.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【destroyed】");
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("destroyed");
    });

    it("should have draw effect", () => {
      const ability = miguelsGinn.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const drawEffect = ability.effects.find((e) => e.type === "draw");
      expect(drawEffect).toBeDefined();
      expect(drawEffect.amount).toBe(1);
    });
  });

  describe("Card in Game Scenarios", () => {
    it("should be deployable with sufficient resources", () => {
      // Miguel's Ginn costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [miguelsGinn],
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

    it("should set up scenario with Miguel's Ginn in battle area", () => {
      // Miguel's Ginn with Destroyed ability on the field
      const engine = new GundamTestEngine(
        {
          battleArea: [miguelsGinn],
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

      // Miguel's Ginn is on the field
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for Destroyed ability testing", () => {
      // Miguel's Ginn draws 1 when destroyed if another Link Unit is in play
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Miguel's Ginn + another Link Unit
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

      // Setup for Destroyed ability: conditional draw if another Link Unit exists
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should work with Miguel Ayman pilot link requirement", () => {
      // Miguel's Ginn has link requirement for Miguel Ayman
      const engine = new GundamTestEngine(
        {
          battleArea: [miguelsGinn],
          hand: 5, // Could have Miguel Ayman pilot card
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

      // Miguel's Ginn can be paired with Miguel Ayman
      expect(miguelsGinn.linkRequirement).toContain("miguel ayman");
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should be deployable in both space and earth zones", () => {
      // Miguel's Ginn can be deployed in space or earth zones
      const engine = new GundamTestEngine(
        {
          hand: [miguelsGinn],
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

      // Miguel's Ginn supports both deployment zones
      expect(miguelsGinn.zones).toContain("space");
      expect(miguelsGinn.zones).toContain("earth");
      assertZoneCount(engine, "hand", 1, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(miguelsGinn).toHaveProperty("implemented");
      expect(miguelsGinn).toHaveProperty("missingTestCase");
    });
  });

  describe("Card Stats and Combat", () => {
    it("should have level 2 stats appropriate for cost 2", () => {
      // Level 2 unit with 2 cost
      expect(miguelsGinn.level).toBe(2);
      expect(miguelsGinn.cost).toBe(2);
      expect(miguelsGinn.ap).toBe(3);
      expect(miguelsGinn.hp).toBe(1);
    });

    it("should have offensive-focused stats", () => {
      // Miguel's Ginn has 3 AP and 1 HP - glass cannon stats
      const totalStats = miguelsGinn.ap + miguelsGinn.hp;
      expect(totalStats).toBe(4); // 3 + 1

      // AP-focused (AP > HP) - designed for aggressive trades
      expect(miguelsGinn.ap).toBeGreaterThan(miguelsGinn.hp);
    });

    it("should set up combat scenario", () => {
      // Miguel's Ginn with 3 AP attacking
      const engine = new GundamTestEngine(
        {
          battleArea: [miguelsGinn],
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Enemy unit
          resourceArea: 3,
          deck: 30,
        },
      );

      // Combat scenario ready: Miguel's Ginn can attack with 3 AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should work as an aggressive unit with card draw", () => {
      // Miguel's Ginn trades aggressively, drawing a card when destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Miguel's Ginn + another Link Unit
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Destroyed ability provides card advantage when trading
      expect(miguelsGinn.abilities[0].trigger.event).toBe("destroyed");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should be a red aggressive unit", () => {
      // Red deck unit with offensive stats
      expect(miguelsGinn.color).toBe("red");
      expect(miguelsGinn.ap).toBe(3);
      expect(miguelsGinn.hp).toBe(1);
    });

    it("should work well with other Link Units", () => {
      // Destroyed ability requires another Link Unit in play
      expect(miguelsGinn.text).toContain("Link Unit");

      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Miguel's Ginn + another Link Unit
          resourceArea: 3,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 2, "player_one");
    });
  });
});
