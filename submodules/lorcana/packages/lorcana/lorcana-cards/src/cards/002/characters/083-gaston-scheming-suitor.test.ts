import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonSchemingSuitor } from "./083-gaston-scheming-suitor";

const opposingCharacter = createMockCharacter({
  id: "gaston-scheming-suitor-opponent",
  name: "Opponent Character",
  cost: 1,
});

describe("Gaston - Scheming Suitor", () => {
  it("gets +3 strength while an opponent has no cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [gastonSchemingSuitor],
        deck: 5,
      },
      {
        hand: [],
        deck: 5,
      },
    );
    const cardId = testEngine.findCardInstanceId(gastonSchemingSuitor, "play", "player_one");

    expect(testEngine.getBoard().cards[cardId]?.strength).toBe(gastonSchemingSuitor.strength + 3);
  });

  it("does not get +3 strength while every opponent still has cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [gastonSchemingSuitor],
        deck: 5,
      },
      {
        hand: [opposingCharacter],
        deck: 5,
      },
    );
    const cardId = testEngine.findCardInstanceId(gastonSchemingSuitor, "play", "player_one");

    expect(testEngine.getBoard().cards[cardId]?.strength).toBe(gastonSchemingSuitor.strength);
  });
});
