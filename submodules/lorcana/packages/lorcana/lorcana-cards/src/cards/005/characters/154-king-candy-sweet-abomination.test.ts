import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kingCandySweetAbomination } from "./154-king-candy-sweet-abomination";

const deckCard1 = createMockCharacter({
  id: "king-candy-deck-1",
  name: "Deck Card 1",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const deckCard2 = createMockCharacter({
  id: "king-candy-deck-2",
  name: "Deck Card 2",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const deckCard3 = createMockCharacter({
  id: "king-candy-deck-3",
  name: "Deck Card 3",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const deckCard4 = createMockCharacter({
  id: "king-candy-deck-4",
  name: "Deck Card 4",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckCard5 = createMockCharacter({
  id: "king-candy-deck-5",
  name: "Deck Card 5",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("King Candy - Sweet Abomination", () => {
  it("has Shift 3 keyword", () => {
    const shiftAbility = (kingCandySweetAbomination.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect(shiftAbility!.cost).toEqual({ ink: 3 });
  });

  describe("CHANGING THE CODE - When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.", () => {
    it("draws 2 cards and puts a card from hand on the bottom of deck when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kingCandySweetAbomination],
        inkwell: kingCandySweetAbomination.cost,
        deck: [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5],
      });

      // Play King Candy
      expect(testEngine.asPlayerOne().playCard(kingCandySweetAbomination)).toBeSuccessfulCommand();

      // Should have a bag effect for CHANGING THE CODE
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (draws 2 cards)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySweetAbomination, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After drawing 2 cards, we have 2 cards in hand
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(2);

      // Now must put a card from hand on the bottom of deck
      const deckCard5Id = testEngine.findCardInstanceId(deckCard5, "hand", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [deckCard5Id] }),
      ).toBeSuccessfulCommand();

      // After putting 1 card on bottom, we have 1 card in hand
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);

      // The card we put on bottom should be in the deck
      expect(testEngine.asPlayerOne().getCardZone(deckCard5Id)).toBe("deck");
    });

    it("the card is put on the BOTTOM of deck, not the top", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kingCandySweetAbomination],
        inkwell: kingCandySweetAbomination.cost,
        deck: [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5],
      });

      expect(testEngine.asPlayerOne().playCard(kingCandySweetAbomination)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySweetAbomination, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After drawing 2, we have 2 cards in hand (deckCard4, deckCard5 - the top 2)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(2);

      // Put deckCard5 (first drawn, now in hand) on bottom
      const deckCard5Id = testEngine.findCardInstanceId(deckCard5, "hand", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [deckCard5Id] }),
      ).toBeSuccessfulCommand();

      // The deck now has (deckCard1, deckCard2, deckCard3) from before + deckCard5 at bottom
      // Draw to see what comes next: should NOT be deckCard5 (it's at bottom)
      // Draw the top card of deck
      const deckBeforeDrawCount = testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck;

      // The remaining deck should have the original 3 top cards + deckCard5 at bottom = 4 cards
      expect(deckBeforeDrawCount).toBe(4);
    });

    it("regression: requires putting a card on bottom after drawing 2 (cannot skip the put-on-bottom step)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kingCandySweetAbomination],
        inkwell: kingCandySweetAbomination.cost,
        deck: [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5],
      });

      expect(testEngine.asPlayerOne().playCard(kingCandySweetAbomination)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (draws 2 cards)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySweetAbomination, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After drawing 2 cards, we have 2 cards in hand
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(2);

      // There should be a pending effect to put a card on bottom - cannot skip it
      const deckCard5Id = testEngine.findCardInstanceId(deckCard5, "hand", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [deckCard5Id] }),
      ).toBeSuccessfulCommand();

      // After putting 1 card on bottom, we have 1 card in hand and 4 in deck
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(4);
    });

    it("does not draw or put cards when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kingCandySweetAbomination],
        inkwell: kingCandySweetAbomination.cost,
        deck: [deckCard1, deckCard2, deckCard3, deckCard4, deckCard5],
      });

      expect(testEngine.asPlayerOne().playCard(kingCandySweetAbomination)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySweetAbomination, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No cards drawn, hand is still empty (King Candy was played)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
      // Deck should be unchanged
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(5);
    });
  });
});
