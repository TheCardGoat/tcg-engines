import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaLostPrince } from "./173-simba-lost-prince";

// A weak defender that Simba will banish in a challenge
const weakDefender = createMockCharacter({
  id: "simba-lost-prince-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 2,
});

// A sturdy defender that will survive a challenge with Simba
const toughDefender = createMockCharacter({
  id: "simba-lost-prince-tough-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 2,
  willpower: 10,
});

describe("Simba - Lost Prince", () => {
  describe("FACE THE PAST - During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    it("allows drawing a card when Simba banishes a character in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaLostPrince],
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().challenge(simbaLostPrince, weakDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

      // FACE THE PAST triggers as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Player should have drawn one card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
    });

    it("can decline the optional draw — hand size stays the same", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaLostPrince],
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().challenge(simbaLostPrince, weakDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the draw
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
    });

    it("does NOT trigger when Simba does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaLostPrince],
          deck: 3,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(simbaLostPrince, toughDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(toughDefender)).toBe("play");

      // Ability should NOT have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does NOT trigger during the opponent's turn", () => {
      const strongOpp = createMockCharacter({
        id: "simba-lost-prince-strong-opp",
        name: "Strong Opponent",
        cost: 5,
        strength: 10,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaLostPrince, exerted: true }],
          deck: 3,
        },
        {
          play: [strongOpp],
          deck: 1,
        },
      );

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Simba — Simba gets banished
      expect(
        testEngine.asPlayerTwo().challenge(strongOpp, simbaLostPrince),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(simbaLostPrince)).toBe("discard");

      // FACE THE PAST should NOT trigger (it's the opponent's turn, and Simba was banished, not the challenger)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
