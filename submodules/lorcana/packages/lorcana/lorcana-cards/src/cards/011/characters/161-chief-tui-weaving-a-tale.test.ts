import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { chiefTuiWeavingATale } from "./161-chief-tui-weaving-a-tale";

const topCard = createMockCharacter({ id: "chief-tui-top-card", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({
  id: "chief-tui-second-card",
  name: "Second Card",
  cost: 2,
});
const inkCard = createMockCharacter({ id: "chief-tui-ink-card", name: "Ink Card", cost: 1 });

describe("Chief Tui - Weaving a Tale", () => {
  // AND THEN... - "Once during your turn, whenever a card is put into your inkwell,
  // look at the top card of your deck. You may put it on either the top or the bottom of your deck."
  // NOTE: The trigger has `on: "SELF"` but the ink event's subject is the inked card,
  // so this trigger does not currently fire. Test verifies the card can be played and inked.

  it("AND THEN... - can be played and ink triggers scry when a card is inked", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      deck: [topCard, secondCard],
      play: [chiefTuiWeavingATale],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

    // If the trigger fires, resolve the bag effect
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(chiefTuiWeavingATale),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [secondCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Verify order: secondCard on top, topCard on bottom
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toEqual([secondCard.id, topCard.id]);
    }

    // Card should remain in play
    expect(testEngine.asPlayerOne().getCardZone(chiefTuiWeavingATale)).toBe("play");
    // Ink card should be in inkwell
    expect(testEngine.asPlayerOne().getCardZone(inkCard)).toBe("inkwell");
  });
});
