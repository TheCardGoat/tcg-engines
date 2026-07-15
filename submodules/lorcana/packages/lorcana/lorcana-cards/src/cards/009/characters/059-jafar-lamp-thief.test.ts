import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jafarLampThief } from "./059-jafar-lamp-thief";

const deckCardA = createMockCharacter({ id: "jafar-deck-a", name: "Deck Card A", cost: 1 });
const deckCardB = createMockCharacter({ id: "jafar-deck-b", name: "Deck Card B", cost: 2 });

describe("Jafar - Lamp Thief", () => {
  describe("I AM YOUR MASTER NOW - When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("triggers a bag effect when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jafarLampThief],
        inkwell: jafarLampThief.cost,
        deck: [deckCardA, deckCardB],
      });

      expect(testEngine.asPlayerOne().playCard(jafarLampThief)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("reorders the top 2 cards when resolving the scry", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jafarLampThief],
        inkwell: jafarLampThief.cost,
        deck: [deckCardA, deckCardB],
      });

      expect(testEngine.asPlayerOne().playCard(jafarLampThief)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(jafarLampThief)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "deck-bottom", cards: [deckCardB, deckCardA] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCardA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(deckCardB)).toBe("deck");
    });
  });
});
