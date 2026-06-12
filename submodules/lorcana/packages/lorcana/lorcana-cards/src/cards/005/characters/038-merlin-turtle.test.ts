import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinTurtle } from "./038-merlin-turtle";

const topDeckCard = createMockCharacter({
  id: "merlin-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "merlin-second-deck",
  name: "Second Deck Card",
  cost: 2,
});

const bottomDeckCard = createMockCharacter({
  id: "merlin-bottom-deck",
  name: "Bottom Deck Card",
  cost: 3,
});

describe("Merlin - Turtle", () => {
  describe("GIVE ME TIME TO THINK - When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("scries 2 cards, puts one on top and one on bottom when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [merlinTurtle],
        inkwell: merlinTurtle.cost,
        deck: [topDeckCard, secondDeckCard, bottomDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(merlinTurtle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(merlinTurtle)).toBeSuccessfulCommand();

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
