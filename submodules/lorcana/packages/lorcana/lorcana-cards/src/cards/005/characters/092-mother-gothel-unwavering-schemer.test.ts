import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { motherGothelUnwaveringSchemer } from "./092-mother-gothel-unwavering-schemer";

const opponentCharacter = createMockCharacter({
  id: "gothel-us-opp-char-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "gothel-us-opp-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Mother Gothel - Unwavering Schemer", () => {
  it("has Shift 4", () => {
    const testEngine = new LorcanaTestEngine({
      play: [motherGothelUnwaveringSchemer],
    });

    const cardModel = testEngine.getCardModel(motherGothelUnwaveringSchemer);
    expect(cardModel.hasShift()).toBe(true);
    expect(cardModel.shiftInkCost).toBe(4);
  });

  describe("THE WORLD IS DARK - When you play this character, each opponent chooses one of their characters and returns that card to their hand.", () => {
    it("triggers when played and opponent must choose one of their characters to return to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelUnwaveringSchemer],
          inkwell: motherGothelUnwaveringSchemer.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter, opponentCharacter2],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(motherGothelUnwaveringSchemer),
      ).toBeSuccessfulCommand();

      // Player two must now choose one of their characters to return to hand
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The chosen character should be returned to hand
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
      // The other character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
    });

    it("does not return anything if opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelUnwaveringSchemer],
          inkwell: motherGothelUnwaveringSchemer.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(motherGothelUnwaveringSchemer),
      ).toBeSuccessfulCommand();

      // Mother Gothel should be in play
      expect(testEngine.asPlayerOne().getCardZone(motherGothelUnwaveringSchemer)).toBe("play");
    });
  });
});
