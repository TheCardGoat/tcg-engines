import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { drFacilierRemarkableGentleman } from "./039-dr-facilier-remarkable-gentleman";

const testSong = createMockSong({
  id: "facilier-test-song",
  name: "Facilier Test Song",
  cost: 2,
  text: "A test song.",
});

const topDeckCard = createMockCharacter({
  id: "facilier-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "facilier-second-deck",
  name: "Second Deck Card",
  cost: 2,
});

const bottomDeckCard = createMockCharacter({
  id: "facilier-bottom-deck",
  name: "Bottom Deck Card",
  cost: 3,
});

describe("Dr. Facilier - Remarkable Gentleman", () => {
  describe("DREAMS MADE REAL - Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("triggers scry 2 when you play a song and accepts the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testSong],
        inkwell: testSong.cost,
        play: [drFacilierRemarkableGentleman],
        deck: [topDeckCard, secondDeckCard, bottomDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(drFacilierRemarkableGentleman),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [secondDeckCard] },
            { zone: "deck-bottom", cards: [bottomDeckCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        bottomDeckCard.id,
        topDeckCard.id,
        secondDeckCard.id,
      ]);
    });
  });
});
