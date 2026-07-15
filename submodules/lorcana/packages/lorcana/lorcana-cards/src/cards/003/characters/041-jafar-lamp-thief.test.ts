import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jafarLampThief } from "./041-jafar-lamp-thief";

const topDeckCard = createMockCharacter({
  id: "jafar-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "jafar-second-deck",
  name: "Second Deck Card",
  cost: 2,
});

const bottomDeckCard = createMockCharacter({
  id: "jafar-bottom-deck",
  name: "Bottom Deck Card",
  cost: 3,
});

describe("Jafar - Lamp Thief", () => {
  describe("I AM YOUR MASTER NOW - When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("scries 2 cards and puts them on bottom in chosen order when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jafarLampThief],
        inkwell: jafarLampThief.cost,
        deck: [topDeckCard, secondDeckCard, bottomDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(jafarLampThief)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(jafarLampThief)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "deck-bottom", cards: [bottomDeckCard, secondDeckCard] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        secondDeckCard.id,
        bottomDeckCard.id,
        topDeckCard.id,
      ]);
    });
  });
});
