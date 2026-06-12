import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beOurGuest } from "@tcg/lorcana-cards/cards/001";

describe("BE OUR GUEST - Look at the top 4 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
  // Effect type(s): scry
  //
  // Test cases to cover:
  // 1. Look at the top N cards of the deck
  // 2. For each card: choose a destination (hand, deck-top, deck-bottom, etc.)
  // 3. At least one of each destination must be filled according to card rules
  // 4. Deck order: cards sent to deck-bottom are placed in player-chosen order
  // 5. Facedown: cards not put in hand remain unknown to opponent
  // 6. Scry with empty deck: no cards to look at (no error, no hang)
  // 7. Scry with fewer cards than N: shows all available cards
  // 8. Player sees all scried cards simultaneously before making placement choices

  it.todo("It should let the player look at and arrange the top cards of their deck", () => {});
});
