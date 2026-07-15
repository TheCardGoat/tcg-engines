import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ladyTremaineImperiousQueen } from "./110-lady-tremaine-imperious-queen";

const opponentCharacter = createMockCharacter({
  id: "lady-tremaine-iq-opp-char-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "lady-tremaine-iq-opp-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const wardCharacter = createMockCharacter({
  id: "lady-tremaine-iq-ward-char",
  name: "Ward Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "ward-ability",
      keyword: "Ward",
      type: "keyword",
      text: "Ward",
    },
  ],
});

describe("Lady Tremaine - Imperious Queen", () => {
  it("has Shift 4", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ladyTremaineImperiousQueen],
    });

    const cardModel = testEngine.getCardModel(ladyTremaineImperiousQueen);
    expect(cardModel.hasShift()).toBe(true);
    expect(cardModel.shiftInkCost).toBe(4);
  });

  describe("POWER TO RULE AT LAST - When you play this character, each opponent chooses and banishes one of their characters.", () => {
    it.skip("triggers when played and opponent must choose and banish one of their characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ladyTremaineImperiousQueen],
          inkwell: ladyTremaineImperiousQueen.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter, opponentCharacter2],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(ladyTremaineImperiousQueen)).toBeSuccessfulCommand();

      // The bag auto-resolves and creates a pending effect for player_two to choose
      // Player two must now choose and banish one of their characters
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The chosen character should be banished
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      // The other character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
    });
  });
});
