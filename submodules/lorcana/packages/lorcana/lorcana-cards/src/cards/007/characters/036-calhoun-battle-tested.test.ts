import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { calhounBattletested } from "./036-calhoun-battle-tested";

const opponentCharacter = createMockCharacter({
  id: "calhoun-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 5,
  willpower: 4,
});

const discardFodder = createMockCharacter({
  id: "calhoun-test-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Calhoun - Battle-Tested", () => {
  describe("TACTICAL ADVANTAGE - When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.", () => {
    it("discards a card and gives chosen opposing character -3 strength when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [calhounBattletested, discardFodder],
          inkwell: calhounBattletested.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(calhounBattletested)).toBeSuccessfulCommand();

      // Accept the optional triggered ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounBattletested, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose and discard a card from hand
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder] }),
      ).toBeSuccessfulCommand();

      // Choose the opposing character to get -3 strength
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The discarded card should be in the discard pile
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");

      // The opposing character should have -3 strength
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );
    });

    it("does not discard or reduce strength when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [calhounBattletested, discardFodder],
          inkwell: calhounBattletested.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(calhounBattletested)).toBeSuccessfulCommand();

      // Decline the optional triggered ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounBattletested, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The card should still be in hand
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");

      // The opposing character should have unchanged strength
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength,
      );
    });

    it("does nothing when hand is empty — discard step impossible so sequence is skipped entirely", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [calhounBattletested],
          inkwell: calhounBattletested.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(calhounBattletested)).toBeSuccessfulCommand();

      // Accept the optional, but hand is empty so discard is impossible
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounBattletested, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // No pending target-selection for opponent character should remain
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

      // Opponent character strength should be unchanged
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength,
      );
    });

    it("the -3 strength expires at the start of the controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [calhounBattletested, discardFodder],
          inkwell: calhounBattletested.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(calhounBattletested)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounBattletested, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Verify -3 strength is applied
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During player two's turn, strength should still be reduced
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );

      // Pass player two's turn - now it's the start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The -3 strength should have expired
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength,
      );
    });
  });
});
