import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { theQueenDiviner } from "./156-the-queen-diviner";

const cheapItem = createMockItem({
  id: "queen-diviner-cheap-item",
  name: "Cheap Item",
  cost: 3,
});

const expensiveItem = createMockItem({
  id: "queen-diviner-expensive-item",
  name: "Expensive Item",
  cost: 4,
});

const nonItemCard1 = createMockCharacter({
  id: "queen-diviner-non-item-1",
  name: "Non Item 1",
  cost: 2,
});

const nonItemCard2 = createMockCharacter({
  id: "queen-diviner-non-item-2",
  name: "Non Item 2",
  cost: 2,
});

const nonItemCard3 = createMockCharacter({
  id: "queen-diviner-non-item-3",
  name: "Non Item 3",
  cost: 2,
});

describe("The Queen - Diviner", () => {
  describe("CONSULT THE SPELLBOOK - {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.", () => {
    it("should allow the player to play an item card for free if it costs 3 or less (enters exerted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenDiviner, isDrying: false }],
        deck: [nonItemCard1, cheapItem, nonItemCard2, nonItemCard3],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenDiviner, {
          ability: "CONSULT THE SPELLBOOK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "play", cards: [cheapItem] },
            {
              zone: "deck-bottom",
              cards: [nonItemCard1, nonItemCard2, nonItemCard3],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard1)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard2)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard3)).toBe("deck");
    });

    it("should allow the player to put an item card into hand if it costs more than 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenDiviner, isDrying: false }],
        deck: [nonItemCard1, expensiveItem, nonItemCard2, nonItemCard3],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenDiviner, {
          ability: "CONSULT THE SPELLBOOK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [expensiveItem] },
            {
              zone: "deck-bottom",
              cards: [nonItemCard1, nonItemCard2, nonItemCard3],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(expensiveItem)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard1)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard2)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonItemCard3)).toBe("deck");
    });

    it("should put the rest of the cards to the bottom of the deck when no item is revealed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenDiviner, isDrying: false }],
        deck: [nonItemCard1, nonItemCard2, nonItemCard3, expensiveItem],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenDiviner, {
          ability: "CONSULT THE SPELLBOOK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            {
              zone: "deck-bottom",
              cards: [nonItemCard1, nonItemCard2, nonItemCard3, expensiveItem],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      // All 4 cards should be in the deck
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toHaveLength(4);
    });

    it("creates a pending scry selection when activating the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenDiviner, isDrying: false }],
        deck: [nonItemCard1, cheapItem, nonItemCard2, nonItemCard3],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenDiviner, {
          ability: "CONSULT THE SPELLBOOK",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
        expect.objectContaining({
          type: "scry-selection",
        }),
      );

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "play", cards: [cheapItem] },
            {
              zone: "deck-bottom",
              cards: [nonItemCard1, nonItemCard2, nonItemCard3],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
    });
  });
});
