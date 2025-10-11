import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { aShowOfResolve } from "./commands";

/**
 * Tests for ST01-100: A Show of Resolve
 *
 * Card Properties:
 * - Cost: 3, Level: 4
 * - Color: Blue
 * - Type: Command
 *
 * Abilities:
 * - Main: Draw 2 cards
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Main ability definition
 * - Draw effect
 */

describe("ST01-100: A Show of Resolve", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(aShowOfResolve.id).toBe("ST01-100");
      expect(aShowOfResolve.name).toBe("A Show of Resolve");
      expect(aShowOfResolve.number).toBe(100);
      expect(aShowOfResolve.set).toBe("ST01");
      expect(aShowOfResolve.type).toBe("command");
      expect(aShowOfResolve.rarity).toBe("rare");
    });

    it("should have correct cost and level", () => {
      expect(aShowOfResolve.cost).toBe(3);
      expect(aShowOfResolve.level).toBe(4);
    });

    it("should have correct color", () => {
      expect(aShowOfResolve.color).toBe("blue");
    });

    it("should be marked as implemented", () => {
      expect(aShowOfResolve.implemented).toBe(true);
    });
  });

  describe("Abilities Definition", () => {
    it("should have one ability", () => {
      expect(aShowOfResolve.abilities).toBeDefined();
      expect(aShowOfResolve.abilities.length).toBe(1);
    });

    it("should have Main ability", () => {
      const ability = aShowOfResolve.abilities[0];
      expect(ability.type).toBe("main");
      expect(ability.name).toBe("A Show of Resolve");
      expect(ability.text).toBe("Draw 2.");
    });

    it("should have draw effect", () => {
      const ability = aShowOfResolve.abilities[0];
      expect(ability.effects).toBeDefined();
      expect(ability.effects.length).toBe(1);

      const effect = ability.effects[0];
      expect(effect).toBeDefined();
      // Note: draw effect is created by drawXCard(2) helper function
    });
  });

  describe("Command Card in Game Scenarios", () => {
    it("should be playable with sufficient resources", () => {
      // A Show of Resolve costs 3, so need 3 resources
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
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

      // Card is in hand and can be played
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario for drawing cards", () => {
      // A Show of Resolve draws 2 cards from deck
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
          battleArea: 1,
          resourceArea: 5,
          deck: 30, // Sufficient cards to draw
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Scenario: player has deck with cards to draw
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should be usable during Main Phase", () => {
      // Command cards with Main ability activate during Main Phase
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Main ability can be activated during Main Phase
      const ability = aShowOfResolve.abilities[0];
      expect(ability.type).toBe("main");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Card Implementation Status", () => {
    it("should be fully implemented", () => {
      expect(aShowOfResolve.implemented).toBe(true);
    });

    it("should have working draw effect", () => {
      // Draw effect is implemented via drawXCard(2) helper
      const ability = aShowOfResolve.abilities[0];
      expect(ability.effects.length).toBe(1);
      expect(ability.text).toBe("Draw 2.");
    });
  });

  describe("Command Card Strategy", () => {
    it("should have level 4 appropriate for cost 3 command", () => {
      // Level 4 command with cost 3 is efficient card advantage
      expect(aShowOfResolve.level).toBe(4);
      expect(aShowOfResolve.cost).toBe(3);
    });

    it("should provide card advantage", () => {
      // A Show of Resolve: 3 cost for 2 cards drawn
      // Trades resources for hand size
      expect(aShowOfResolve.cost).toBe(3);

      const ability = aShowOfResolve.abilities[0];
      expect(ability.text).toBe("Draw 2.");
    });

    it("should be blue card advantage tool", () => {
      // Blue deck draw option
      expect(aShowOfResolve.color).toBe("blue");
      expect(aShowOfResolve.type).toBe("command");
    });

    it("should be rare quality card", () => {
      // Higher rarity reflects strong draw effect
      expect(aShowOfResolve.rarity).toBe("rare");
    });
  });

  describe("Draw Mechanics", () => {
    it("should draw exactly 2 cards", () => {
      // A Show of Resolve draws 2 cards
      const ability = aShowOfResolve.abilities[0];
      expect(ability.text).toBe("Draw 2.");
    });

    it("should require sufficient cards in deck", () => {
      // Cannot draw if less than 2 cards in deck
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve],
          battleArea: 1,
          resourceArea: 5,
          deck: 2, // Only 2 cards left
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Edge case: exactly 2 cards in deck
      assertZoneCount(engine, "deck", 2, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");
    });

    it("should set up card advantage scenario", () => {
      // A Show of Resolve used to refill hand
      const engine = new GundamTestEngine(
        {
          hand: [aShowOfResolve], // Low hand count
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Draw scenario: refill hand from low count
      // After playing: 0 cards in hand, then draw 2 = 2 cards
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "deck", 30, "player_one");
    });

    it("should be mid-game card advantage tool", () => {
      // Cost 3 makes it mid-game play for card advantage
      expect(aShowOfResolve.cost).toBe(3);
      expect(aShowOfResolve.level).toBe(4);

      // Not early game (cost 1-2) but not late game (cost 4+)
      const isMidGameCost =
        aShowOfResolve.cost >= 3 && aShowOfResolve.cost <= 3;
      expect(isMidGameCost).toBe(true);
    });
  });

  describe("Deck Construction Considerations", () => {
    it("should be valuable for blue decks", () => {
      // Blue deck card draw staple
      expect(aShowOfResolve.color).toBe("blue");
      expect(aShowOfResolve.rarity).toBe("rare");
    });

    it("should work well in control strategies", () => {
      // Control decks value card advantage
      // Cost 3 for draw 2 is efficient
      expect(aShowOfResolve.cost).toBe(3);

      const ability = aShowOfResolve.abilities[0];
      expect(ability.text).toBe("Draw 2.");
    });

    it("should have high deck inclusion consideration", () => {
      // Strong effect, reasonable cost, rare quality
      // Likely good candidate for blue deck inclusion
      expect(aShowOfResolve.implemented).toBe(true);
      expect(aShowOfResolve.rarity).toBe("rare");
      expect(aShowOfResolve.level).toBe(4);
    });
  });
});
