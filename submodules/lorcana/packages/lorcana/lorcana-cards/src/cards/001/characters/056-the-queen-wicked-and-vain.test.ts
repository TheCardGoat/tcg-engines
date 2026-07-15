import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theQueenWickedAndVain } from "./056-the-queen-wicked-and-vain";

const firstDeckCard = createMockCharacter({
  id: "the-queen-wicked-and-vain-top",
  name: "The Queen Test Draw",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "the-queen-wicked-and-vain-second",
  name: "The Queen Second Card",
  cost: 2,
});

describe("The Queen - Wicked and Vain", () => {
  it("draws a card when you exert her ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [firstDeckCard, secondDeckCard],
      play: [{ card: theQueenWickedAndVain, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(1);
  });
});
