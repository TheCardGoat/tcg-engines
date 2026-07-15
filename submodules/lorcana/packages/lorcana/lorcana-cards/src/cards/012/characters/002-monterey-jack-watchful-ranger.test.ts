import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { montereyJackWatchfulRanger } from "./002-monterey-jack-watchful-ranger";

const topDeckCharacter = createMockCharacter({
  id: "monterey-jack-top-character",
  name: "Top Deck Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const topDeckItem = createMockItem({
  id: "monterey-jack-top-item",
  name: "Top Deck Item",
  cost: 2,
});

const deckFiller = createMockCharacter({
  id: "monterey-jack-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Monterey Jack - Watchful Ranger", () => {
  describe("BIRD'S-EYE VIEW - When you play this character, you may reveal the top card of your deck. If it's a character card, you may put it into your hand. Otherwise, put it on the bottom of your deck.", () => {
    it("puts a revealed character card into hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [montereyJackWatchfulRanger],
        inkwell: montereyJackWatchfulRanger.cost,
        deck: [deckFiller, topDeckCharacter],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(montereyJackWatchfulRanger)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(montereyJackWatchfulRanger, {
          resolveOptional: true,
          destinations: [{ zone: "hand", cards: [topDeckCharacter] }],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(topDeckCharacter)).toBe("hand");
    });

    it("puts a non-character top card on the bottom of the deck when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [montereyJackWatchfulRanger],
        inkwell: montereyJackWatchfulRanger.cost,
        deck: [deckFiller, topDeckItem],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(montereyJackWatchfulRanger)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(montereyJackWatchfulRanger, {
          resolveOptional: true,
          destinations: [{ zone: "deck-bottom", cards: [topDeckItem] }],
        }),
      ).toBeSuccessfulCommand();

      // The item card should remain in the deck (placed at the bottom)
      expect(playerOne.getCardZone(topDeckItem)).toBe("deck");

      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toHaveLength(2);
      // Item should be at the bottom (index 0)
      expect(deckIds[0]).toBe(topDeckItem.id);
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [montereyJackWatchfulRanger],
        inkwell: montereyJackWatchfulRanger.cost,
        deck: [deckFiller, topDeckCharacter],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(montereyJackWatchfulRanger)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(montereyJackWatchfulRanger, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Character should remain in the deck
      expect(playerOne.getCardZone(topDeckCharacter)).toBe("deck");
    });
  });
});
