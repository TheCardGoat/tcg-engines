import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloMakingAWish } from "../../001";
import { jasmineDesertWarrior } from "./078-jasmine-desert-warrior";

const opponentCardInHand = createMockCharacter({
  id: "jasmine-test-opponent-hand-card",
  name: "Opponent Hand Card",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const challenger = createMockCharacter({
  id: "jasmine-test-challenger",
  name: "Challenger",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Jasmine - Desert Warrior", () => {
  describe("CUNNING MANEUVER - When you play this character and whenever she's challenged, each opponent chooses and discards a card.", () => {
    it("when played, each opponent must choose and discard a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jasmineDesertWarrior],
          inkwell: jasmineDesertWarrior.cost,
        },
        {
          hand: [liloMakingAWish],
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(
        liloMakingAWish,
        "hand",
        "player_two",
      );

      expect(testEngine.asPlayerOne().playCard(jasmineDesertWarrior)).toBeSuccessfulCommand();

      // The opponent should have a pending choice (discard a card)
      const pendingChoice = testEngine.asServer().getState().ctx.priority.pendingChoice;
      expect(pendingChoice).toBeTruthy();

      expect(
        testEngine
          .asPlayerTwo()
          .resolveEffect(pendingChoice!.requestID, { targets: [opponentDiscardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(liloMakingAWish)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(jasmineDesertWarrior)).toBe("play");
    });

    it("when challenged, each opponent of Jasmine's controller must choose and discard a card", () => {
      // Player one controls Jasmine (exerted). Player two challenges with their character.
      // The effect says "each opponent [of Jasmine's controller]" must discard, meaning player two must discard.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineDesertWarrior, exerted: true }],
        },
        {
          play: [challenger],
          hand: [opponentCardInHand],
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(
        opponentCardInHand,
        "hand",
        "player_two",
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      expect(
        testEngine.asPlayerTwo().challenge(challenger, jasmineDesertWarrior),
      ).toBeSuccessfulCommand();

      // Jasmine's controller resolves the trigger from the bag, then the opponent
      // chooses the discard for the resulting pending effect.
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineDesertWarrior),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentDiscardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCardInHand)).toBe("discard");
    });
  });
});
