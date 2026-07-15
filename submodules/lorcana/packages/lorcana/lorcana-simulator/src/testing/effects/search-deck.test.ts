import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { merlinIntellectualVisionary } from "@tcg/lorcana-cards/cards/005";

describe("MERLIN - Intellectual Visionary - When you play this character, search your deck for a card.", () => {
  // Effect type(s): search-deck, search (alias), put-in-hand (alias), put-into-hand (alias)
  //
  // Test cases to cover:
  // 1. search-deck: player searches through the deck for a card matching a filter
  // 2. put-in-hand / put-into-hand aliases: found card goes to hand
  // 3. Deck is shuffled after searching (standard Lorcana rule)
  // 4. If no matching card is found: no card added to hand, deck still shuffled
  // 5. Can search for specific name, type, classification, or keyword
  // 6. Filter restricts which cards are valid to pick
  // 7. Player must choose one card if any matching card exists (cannot pass)
  // 8. Searching an empty deck: no card found, deck remains empty

  it.todo("It should let the player find a matching card from their deck and put it in hand", () => {});
});
