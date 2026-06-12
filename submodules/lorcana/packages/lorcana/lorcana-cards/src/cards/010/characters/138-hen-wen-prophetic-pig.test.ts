import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { henWenPropheticPig } from "./138-hen-wen-prophetic-pig";

const topCard = createMockCharacter({ id: "hen-wen-top-card", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({ id: "hen-wen-second-card", name: "Second Card", cost: 2 });

describe("Hen Wen - Prophetic Pig", () => {
  it("FUTURE SIGHT - looks at top card and can put it on bottom when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topCard, secondCard],
      play: [{ card: henWenPropheticPig, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(henWenPropheticPig)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(henWenPropheticPig),
    ).toBeSuccessfulCommand();
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
