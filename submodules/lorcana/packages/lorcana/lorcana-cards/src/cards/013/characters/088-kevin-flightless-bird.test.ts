import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kevinFlightlessBird } from "./088-kevin-flightless-bird";

const deckFiller = createMockCharacter({
  id: "kevin-flightless-bird-deck-filler",
  name: "Deck Filler",
  cost: 1,
});

describe("Kevin - Flightless Bird", () => {
  it("puts herself on top of your deck when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kevinFlightlessBird],
      deck: [deckFiller],
    });

    expect(testEngine.asPlayerOne().quest(kevinFlightlessBird)).toBeSuccessfulCommand();

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", "player_one");
    expect(deckIds.at(-1)).toBe(kevinFlightlessBird.id);
  });
});
