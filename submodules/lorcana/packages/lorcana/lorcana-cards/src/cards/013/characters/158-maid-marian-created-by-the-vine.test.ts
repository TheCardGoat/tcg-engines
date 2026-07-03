import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maidMarianCreatedByTheVine } from "./158-maid-marian-created-by-the-vine";

const floodbornAlly = createMockCharacter({
  id: "maid-marian-floodborn-ally",
  name: "Floodborn Ally",
  cost: 2,
  strength: 0,
  willpower: 1,
  classifications: ["Floodborn", "Ally"],
});

const opposingChallenger = createMockCharacter({
  id: "maid-marian-opposing-challenger",
  name: "Opposing Challenger",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const deckCard = createMockCharacter({
  id: "maid-marian-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Maid Marian - Created by the Vine", () => {
  it("may put the top card of your deck into your inkwell when your Floodborn is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [maidMarianCreatedByTheVine, { card: floodbornAlly, exerted: true }],
        deck: [deckCard],
      },
      {
        play: [{ card: opposingChallenger, isDrying: false }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingChallenger, floodbornAlly),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(maidMarianCreatedByTheVine, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("inkwell");
  });
});
