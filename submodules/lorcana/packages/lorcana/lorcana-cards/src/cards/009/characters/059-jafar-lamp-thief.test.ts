import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jafarLampThief } from "./059-jafar-lamp-thief";

const topDeckCard = createMockCharacter({
  id: "jafar-set9-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "jafar-set9-second-deck",
  name: "Second Deck Card",
  cost: 2,
});

const bottomDeckCard = createMockCharacter({
  id: "jafar-set9-bottom-deck",
  name: "Bottom Deck Card",
  cost: 3,
});

const ownCharacter = createMockCharacter({
  id: "jafar-set9-own-character",
  name: "Own Character",
  cost: 2,
});

const opposingCharacter = createMockCharacter({
  id: "jafar-set9-opposing-character",
  name: "Opposing Character",
  cost: 2,
});

function playJafar() {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [jafarLampThief],
      inkwell: jafarLampThief.cost,
      play: [ownCharacter],
      deck: [topDeckCard, secondDeckCard, bottomDeckCard],
    },
    {
      play: [opposingCharacter],
    },
  );

  expect(testEngine.asPlayerOne().playCard(jafarLampThief)).toBeSuccessfulCommand();
  expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  expect(testEngine.asPlayerOne().resolvePendingByCard(jafarLampThief)).toBeSuccessfulCommand();

  return testEngine;
}

describe("Jafar - Lamp Thief", () => {
  describe("I AM YOUR MASTER NOW - When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("puts one looked-at card on top of the deck and the other on the bottom", () => {
      const testEngine = playJafar();

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
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });

    it("can keep the original top card on top of the deck", () => {
      const testEngine = playJafar();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [bottomDeckCard] },
            { zone: "deck-bottom", cards: [secondDeckCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        secondDeckCard.id,
        topDeckCard.id,
        bottomDeckCard.id,
      ]);
    });

    it("does not allow both looked-at cards to go on the bottom", () => {
      const testEngine = playJafar();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "deck-bottom", cards: [bottomDeckCard, secondDeckCard] }],
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("does not put any character in play on the bottom of a deck", () => {
      const testEngine = playJafar();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [secondDeckCard] },
            { zone: "deck-bottom", cards: [bottomDeckCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(jafarLampThief)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("play");
    });
  });
});
