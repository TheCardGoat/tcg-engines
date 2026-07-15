import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { peteGhostOfChristmasFuture } from "./154-pete-ghost-of-christmas-future";

const deckCard1 = createMockCharacter({
  id: "pete-deck-card-1",
  name: "Pete Deck Card 1",
  cost: 1,
});

const deckCard2 = createMockCharacter({
  id: "pete-deck-card-2",
  name: "Pete Deck Card 2",
  cost: 1,
});

const deckCard3 = createMockCharacter({
  id: "pete-deck-card-3",
  name: "Pete Deck Card 3",
  cost: 1,
});

const deckCard4 = createMockCharacter({
  id: "pete-deck-card-4",
  name: "Pete Deck Card 4",
  cost: 1,
});

const deckCard5 = createMockCharacter({
  id: "pete-deck-card-5",
  name: "Pete Deck Card 5",
  cost: 1,
});

describe("Pete - Ghost of Christmas Future", () => {
  describe("FOREBODING GLANCE - Whenever this character quests, look at cards equal to the number of cards under him, put one in hand, rest on bottom", () => {
    it("does not trigger when questing with 0 cards under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: peteGhostOfChristmasFuture, isDrying: false }],
        deck: [deckCard1, deckCard2, deckCard3],
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(testEngine.asPlayerOne().quest(peteGhostOfChristmasFuture)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Hand should be unchanged
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(peteGhostOfChristmasFuture.lore);
    });

    it("should not trigger if another character has cards under them but Pete does not", () => {
      const anotherCharacter = createMockCharacter({
        id: "another-char-with-cards-under",
        name: "Another Character",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: peteGhostOfChristmasFuture, isDrying: false }, { card: anotherCharacter }],
        deck: [deckCard1, deckCard2, deckCard3],
      });

      // Put a card under the other character, not Pete
      const anotherIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const anotherId = anotherIds.find(
        (id) => testEngine.getCardDefinitionId(id) === anotherCharacter.id,
      );
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(anotherId!, deckCards[0]!);

      expect(testEngine.getCardsUnder(peteGhostOfChristmasFuture)).toHaveLength(0);
      expect(testEngine.getCardsUnder(anotherId!)).toHaveLength(1);

      expect(testEngine.asPlayerOne().quest(peteGhostOfChristmasFuture)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("with 1 card under him, looks at 1 card and player can put it in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: peteGhostOfChristmasFuture, isDrying: false }],
        deck: [deckCard1, deckCard2, deckCard3],
        inkwell: 10,
      });

      // Activate Boost to put 1 card under Pete (deckCard1 goes under)
      expect(
        testEngine.asPlayerOne().activateAbility(peteGhostOfChristmasFuture, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(peteGhostOfChristmasFuture)).toHaveLength(1);

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      // Quest triggers FOREBODING GLANCE
      expect(testEngine.asPlayerOne().quest(peteGhostOfChristmasFuture)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the bag - scry looks at 1 card (deckCard2, now top of deck)
      // Use instance ID from deck since card refs may not resolve from hidden zone
      const topOfDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const topCardId = topOfDeck.at(-1)!;

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(peteGhostOfChristmasFuture),
      ).toBeSuccessfulCommand();

      // Resolve the scry - put the looked-at card into hand
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "hand", cards: [topCardId] }],
        }),
      ).toBeSuccessfulCommand();

      // Hand should have 1 more card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
    });

    it("with 2 cards under him, looks at 2 cards, puts one in hand and rest on bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: peteGhostOfChristmasFuture, isDrying: false }],
        deck: [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5],
        inkwell: 10,
      });

      // Activate Boost twice (need to pass turns in between) to put 2 cards under Pete
      expect(
        testEngine.asPlayerOne().activateAbility(peteGhostOfChristmasFuture, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();
      expect(
        testEngine.asPlayerOne().activateAbility(peteGhostOfChristmasFuture, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(peteGhostOfChristmasFuture)).toHaveLength(2);

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      // Quest triggers FOREBODING GLANCE - scry 2 (2 cards under)
      expect(testEngine.asPlayerOne().quest(peteGhostOfChristmasFuture)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Get the top 2 cards of deck (which will be looked at)
      const topOfDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const firstCardId = topOfDeck[0]!;

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(peteGhostOfChristmasFuture),
      ).toBeSuccessfulCommand();

      // Resolve the scry - put one card in hand, the other goes to bottom via remainder
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "hand", cards: [firstCardId] }],
        }),
      ).toBeSuccessfulCommand();

      // Hand should have 1 more card (picked 1 from the 2 looked at)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
    });
  });
});
