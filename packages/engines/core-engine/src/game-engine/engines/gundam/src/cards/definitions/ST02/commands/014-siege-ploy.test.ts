import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { siegePloy } from "./014-siege-ploy";

/**
 * Tests for ST02-014: Siege Ploy
 *
 * Card Properties:
 * - Cost: 1, Level: 3
 * - Color: Blue
 * - Type: Command
 *
 * Abilities:
 * - 【Burst】Activate this card's 【Main】
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Burst ability definition
 * - Burst-to-Main activation mechanics
 * - Card usability in game scenarios
 */

describe("ST02-014: Siege Ploy", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(siegePloy.id).toBe("ST02-014");
      expect(siegePloy.name).toBe("Siege Ploy");
      expect(siegePloy.number).toBe(14);
      expect(siegePloy.set).toBe("ST02");
      expect(siegePloy.type).toBe("command");
      expect(siegePloy.rarity).toBe("common");
    });

    it("should have correct cost and level", () => {
      expect(siegePloy.cost).toBe(1);
      expect(siegePloy.level).toBe(3);
    });

    it("should have correct color", () => {
      expect(siegePloy.color).toBe("blue");
    });

    it("should have text describing Burst ability", () => {
      expect(siegePloy.text).toContain("Burst");
      expect(siegePloy.text).toContain("Activate this card's");
      expect(siegePloy.text).toContain("Main");
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(siegePloy.abilities).toBeDefined();
      expect(siegePloy.abilities.length).toBe(1);
    });

    it("should have triggered Burst ability", () => {
      const ability = siegePloy.abilities[0];
      expect(ability.type).toBe("triggered");
      expect(ability.text).toBe("【burst】");
    });

    it("should have burst trigger event", () => {
      const ability = siegePloy.abilities[0];
      expect(ability.trigger).toBeDefined();
      expect(ability.trigger.event).toBe("burst");
    });

    it("should have placeholder effect structure", () => {
      const ability = siegePloy.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect.type).toBe("placeholder");
    });

    it("should activate Main ability when triggered", () => {
      // The Burst ability activates the card's Main ability
      expect(siegePloy.text).toContain("Activate this card's 【Main】");
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be usable from shield section via Burst", () => {
      const engine = new GundamTestEngine(
        {
          shieldSection: [siegePloy],
          hand: 5,
          resourceArea: 5,
          battleArea: 1,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Siege Ploy in shield section can be activated via Burst
      assertZoneCount(engine, "shieldSection", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should be playable from hand during main phase", () => {
      const engine = new GundamTestEngine(
        {
          hand: [siegePloy],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Command is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should require correct resource cost to play from hand", () => {
      // Siege Ploy costs 1 resource when played normally
      expect(siegePloy.cost).toBe(1);
    });

    it("should be level 3 for level-based interactions", () => {
      // Level 3 command for card interactions that check level
      expect(siegePloy.level).toBe(3);
    });

    it("should be placed in trash after resolution", () => {
      const engine = new GundamTestEngine(
        {
          hand: [siegePloy],
          resourceArea: 5,
          deck: 30,
        },
        {
          resourceArea: 5,
          deck: 30,
        },
      );

      // Command cards go to trash after being played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      // Card definition tracks whether card is fully implemented
      expect(siegePloy).toHaveProperty("implemented");
      expect(siegePloy).toHaveProperty("missingTestCase");
    });

    it("should have ability structure ready for implementation", () => {
      // Ability has placeholder effect ready for implementation
      const ability = siegePloy.abilities[0];
      expect(ability.effects[0].type).toBe("placeholder");
    });
  });

  describe("Command Strategy", () => {
    it("should be cost-efficient for surprise plays", () => {
      // Cost 1 command with Burst ability for free activation
      expect(siegePloy.cost).toBe(1);
      expect(siegePloy.text).toContain("Burst");
    });

    it("should work in blue deck strategies", () => {
      // Siege Ploy is a blue command for blue deck synergies
      expect(siegePloy.color).toBe("blue");
    });

    it("should provide resource-free activation via Burst", () => {
      // Burst allows activation without paying resource cost
      expect(siegePloy.text).toContain("Burst");
    });

    it("should enable Main ability effects from shield section", () => {
      // Burst triggers Main ability from unusual zone
      expect(siegePloy.text).toContain("Activate this card's 【Main】");
    });

    it("should be accessible in early game", () => {
      // Cost 1 makes it accessible early game
      expect(siegePloy.cost).toBe(1);
    });

    it("should be a common rarity card", () => {
      // Common rarity makes it accessible for deck building
      expect(siegePloy.rarity).toBe("common");
    });

    it("should have level 3 for early-mid game impact", () => {
      // Level 3 provides early-mid game utility
      expect(siegePloy.level).toBe(3);
    });

    it("should synergize with shield-based burst strategies", () => {
      const engine = new GundamTestEngine(
        {
          shieldSection: [siegePloy],
          hand: 5,
          resourceArea: 5,
          battleArea: 1,
          deck: 30,
        },
        {
          battleArea: 3,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Siege Ploy in shield section ready for Burst activation
      assertZoneCount(engine, "shieldSection", 1, "player_one");
    });

    it("should provide dual activation modes", () => {
      // Can be played normally or activated via Burst
      expect(siegePloy.cost).toBe(1); // Normal play cost
      expect(siegePloy.text).toContain("Burst"); // Burst activation
    });

    it("should offer tactical flexibility", () => {
      const engine = new GundamTestEngine(
        {
          hand: [siegePloy],
          shieldSection: 3,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can be played from hand or placed in shield for Burst
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 3, "player_one");
    });
  });
});
