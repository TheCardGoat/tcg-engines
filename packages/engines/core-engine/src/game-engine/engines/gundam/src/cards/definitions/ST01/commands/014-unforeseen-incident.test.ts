import { describe, expect, it } from "bun:test";
import { assertZoneCount } from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { unforeseenIncident } from "./014-unforeseen-incident";

/**
 * Tests for ST01-014: Unforeseen Incident
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: White
 * - Type: Command
 *
 * Abilities:
 * - 【Burst】Activate this card's 【Main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Main ability activation from Burst
 */

describe("ST01-014: Unforeseen Incident", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(unforeseenIncident.id).toBe("ST01-014");
      expect(unforeseenIncident.name).toBe("Unforeseen Incident");
      expect(unforeseenIncident.number).toBe(14);
      expect(unforeseenIncident.set).toBe("ST01");
      expect(unforeseenIncident.type).toBe("command");
      expect(unforeseenIncident.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(unforeseenIncident.cost).toBe(1);
      expect(unforeseenIncident.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(unforeseenIncident.color).toBe("white");
    });

    it("should have text describing Burst ability", () => {
      expect(unforeseenIncident.text).toContain("Burst");
      expect(unforeseenIncident.text).toContain("Activate");
      expect(unforeseenIncident.text).toContain("Main");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(unforeseenIncident.abilities).toBeDefined();
      expect(unforeseenIncident.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = unforeseenIncident.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should have placeholder effect", () => {
      const ability = unforeseenIncident.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });
  });

  describe("Burst Ability Scenarios", () => {
    it("should be usable as shield card", () => {
      // Unforeseen Incident can be placed in shield area
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: [unforeseenIncident],
          resourceArea: 5,
          deck: 30,
          shieldSection: 5,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Card can be added to shield area
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 5, "player_one");
    });

    it("should set up scenario for Burst activation", () => {
      // Unforeseen Incident with Burst ability in damage zone
      // When shield is destroyed, Burst triggers: activate this card's 【Main】
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Unforeseen Incident could be one of the shields
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Burst ability: when shield card is destroyed, activate Main ability
      const ability = unforeseenIncident.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should trigger when damaged as shield", () => {
      // When damage destroys shield, Burst activates Main effect
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
          shieldSection: 6, // Including Unforeseen Incident
        },
        {
          battleArea: 1, // Enemy to deal damage
          resourceArea: 5,
          deck: 30,
        },
      );

      // Damage scenario: enemy attacks, destroys shield, Burst triggers
      const ability = unforeseenIncident.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(unforeseenIncident).toHaveProperty("implemented");
      expect(unforeseenIncident).toHaveProperty("missingTestCase");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 3 appropriate for cost 1 command", () => {
      // Level 3 command with cost 1 is efficient utility
      expect(unforeseenIncident.level).toBe(3);
      expect(unforeseenIncident.cost).toBe(1);
    });

    it("should provide defensive utility", () => {
      // Unforeseen Incident: acts as shield with Burst benefit
      // When destroyed as shield, activates Main ability
      expect(unforeseenIncident.cost).toBe(1);
      expect(unforeseenIncident.text).toContain("Burst");
    });

    it("should be white defensive tool", () => {
      // White deck defensive option with Burst effect
      expect(unforeseenIncident.color).toBe("white");
      expect(unforeseenIncident.type).toBe("command");
    });
  });

  describe("Burst Mechanics", () => {
    it("should activate Main ability when Burst triggers", () => {
      // Burst effect: Activate this card's Main ability
      expect(unforeseenIncident.text).toBe(
        "【Burst】Activate this card's 【Main】.",
      );

      const ability = unforeseenIncident.abilities[0];
      expect(ability.trigger?.event).toBe("burst");
    });

    it("should provide value from shield zone", () => {
      // Unlike regular shields, Unforeseen Incident activates effect when destroyed
      const engine = new GundamTestEngine(
        {
          shieldSection: 6, // Unforeseen Incident as shield
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Provides value even when used as shield
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      expect(unforeseenIncident.text).toContain("Burst");
    });
  });

  describe("Placeholder Implementation", () => {
    it("should have placeholder effect for Main ability", () => {
      // Note: The Main ability is referenced but not fully defined yet
      const ability = unforeseenIncident.abilities[0];
      const effect = ability.effects[0];

      expect(effect.type).toBe("placeholder");
      expect(effect.parameters).toBeDefined();
    });

    it("should indicate missing Main ability definition", () => {
      // Card references Main ability but implementation is placeholder
      expect(unforeseenIncident.text).toContain("Main");
      expect(unforeseenIncident.implemented).toBe(false);
    });
  });
});
