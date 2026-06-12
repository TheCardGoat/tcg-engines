import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { puaPotbelliedBuddy } from "./053-pua-potbellied-buddy";

const strongAttacker = createMockCharacter({
  id: "pua-test-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 10,
  willpower: 3,
});

describe("Pua - Potbellied Buddy", () => {
  describe("ALWAYS THERE - When this character is banished, you may shuffle this card into your deck.", () => {
    it("shuffles Pua into owner's deck when player accepts the optional after banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: puaPotbelliedBuddy, exerted: true }],
          deck: 5,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two challenges Pua (10 strength vs 2 willpower - Pua is banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, puaPotbelliedBuddy),
      ).toBeSuccessfulCommand();

      // Pua should be banished (not in play)
      expect(testEngine.asPlayerOne().getCardZone(puaPotbelliedBuddy)).not.toBe("play");

      // Resolve the optional triggered ability - accept shuffling Pua into deck
      testEngine.asPlayerOne().resolvePendingByCard(puaPotbelliedBuddy, { resolveOptional: true });

      // Pua should be in the deck (shuffled in)
      expect(testEngine.asPlayerOne().getCardZone(puaPotbelliedBuddy)).not.toBe("discard");

      // Deck count should have increased by 1 (Pua shuffled in)
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore + 1);
    });

    it("does NOT shuffle Pua into deck when player declines the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: puaPotbelliedBuddy, exerted: true }],
          deck: 5,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two challenges Pua (10 strength vs 2 willpower - Pua is banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, puaPotbelliedBuddy),
      ).toBeSuccessfulCommand();

      // Pua should be banished (in discard)
      expect(testEngine.asPlayerOne().getCardZone(puaPotbelliedBuddy)).toBe("discard");

      // Resolve the optional triggered ability - decline
      testEngine.asPlayerOne().resolvePendingByCard(puaPotbelliedBuddy, { resolveOptional: false });

      // Pua should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(puaPotbelliedBuddy)).toBe("discard");

      // Deck count should not have changed
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore);
    });

    it("triggers when banished by damage (manualSetDamage)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [puaPotbelliedBuddy],
          deck: 5,
        },
        {
          deck: 1,
        },
      );

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      // Banish Pua with enough damage
      expect(testEngine.asServer().manualSetDamage(puaPotbelliedBuddy, 10)).toBeSuccessfulCommand();

      // Pua should be banished
      expect(testEngine.asPlayerOne().getCardZone(puaPotbelliedBuddy)).not.toBe("play");

      // Resolve the optional triggered ability - accept
      testEngine.asPlayerOne().resolvePendingByCard(puaPotbelliedBuddy, { resolveOptional: true });

      // Deck count should increase by 1
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore + 1);
    });
  });
});
