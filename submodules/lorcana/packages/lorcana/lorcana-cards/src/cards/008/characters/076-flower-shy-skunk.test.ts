import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flowerShySkunk } from "./076-flower-shy-skunk";

const topCard = createMockCharacter({ id: "flower-top-card", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({ id: "flower-second-card", name: "Second Card", cost: 2 });
const anotherCharacter = createMockCharacter({
  id: "flower-another-char",
  name: "Another Character",
  cost: 1,
});

describe("Flower - Shy Skunk", () => {
  it("LOOKING FOR FRIENDS - looks at top card and can put it on bottom when another character is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [anotherCharacter],
      inkwell: anotherCharacter.cost,
      deck: [topCard, secondCard],
      play: [flowerShySkunk],
    });

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(flowerShySkunk)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    // Verify order: topCard on top, secondCard on bottom
    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([secondCard.id, topCard.id]);
  });
});
