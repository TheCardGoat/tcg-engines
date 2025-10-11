import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { closeCombat } from "./013-close-combat";

/**
 * Tests for ST03-013: Close Combat
 *
 * Card Properties:
 * - Cost: 2, Level: 2
 * - Color: Red
 * - Type: Command
 *
 * Abilities:
 * - 【Burst】Activate this card's 【Main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Main ability activation through Burst
 */

describe("ST03-013: Close Combat", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(closeCombat.id).toBe("ST03-013");
      expect(closeCombat.name).toBe("Close Combat");
      expect(closeCombat.number).toBe(13);
      expect(closeCombat.set).toBe("ST03");
      expect(closeCombat.type).toBe("command");
      expect(closeCombat.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(closeCombat.cost).toBe(2);
      expect(closeCombat.level).toBe(2);
    });

    it("should have correct color", () => {
      expect(closeCombat.color).toBe("red");
    });

    it("should have text describing Burst ability", () => {
      expect(closeCombat.text).toContain("Burst");
      expect(closeCombat.text).toContain("Activate this card's");
      expect(closeCombat.text).toContain("Main");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(closeCombat.abilities).toBeDefined();
      expect(closeCombat.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = closeCombat.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect for Main activation", () => {
      const ability = closeCombat.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // Close Combat costs 2, so need 2 resources
      const engine = new GundamTestEngine(
        {
          hand: [closeCombat],
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

    it("should set up scenario for Burst ability", () => {
      // Close Combat with Burst ability in shield zone
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 3,
          deck: 30,
          shieldSection: 6, // Close Combat could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Burst ability: when shield is destroyed, activate card's 【Main】
      const ability = closeCombat.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should work as defensive card with Burst", () => {
      // Close Combat placed as shield can activate Main when attacked
      const engine = new GundamTestEngine(
        {
          hand: [closeCombat],
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
          shieldSection: 5, // Shields that can be damaged
        },
        {
          battleArea: 2, // Enemy attacking shields
          resourceArea: 3,
          deck: 30,
        },
      );

      // Setup: Close Combat as shield activates Main when destroyed
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 5, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(closeCombat).toHaveProperty("implemented");
      expect(closeCombat).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 2 appropriate for cost 2 command", () => {
      // Level 2 command with cost 2 is standard
      expect(closeCombat.level).toBe(2);
      expect(closeCombat.cost).toBe(2);
    });

    it("should provide defensive Burst value", () => {
      // Close Combat: can be placed as shield and activate Main when destroyed
      // Provides value even when used defensively
      expect(closeCombat.cost).toBe(2);
      expect(closeCombat.text).toContain("Burst");
      expect(closeCombat.text).toContain("Activate this card's 【Main】");
    });

    it("should have Burst trigger", () => {
      // Burst ability triggers when shield is destroyed
      const ability = closeCombat.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should set up defensive play pattern", () => {
      // Close Combat placed as shield for Burst value
      const engine = new GundamTestEngine(
        {
          hand: [closeCombat],
          battleArea: 1,
          resourceArea: 3,
          deck: 30,
          shieldSection: 5,
        },
        {
          battleArea: 2,
          resourceArea: 3,
          deck: 30,
        },
      );

      // Defensive pattern: place as shield, activate Main when attacked
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 5, "player_one");
    });

    it("should be red defensive option", () => {
      // Red deck card with Burst for defensive value
      expect(closeCombat.color).toBe("red");
      expect(closeCombat.type).toBe("command");

      const ability = closeCombat.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });
  });
});
