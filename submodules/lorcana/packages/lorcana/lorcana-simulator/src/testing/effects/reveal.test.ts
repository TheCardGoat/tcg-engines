import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalCuriousChild } from "@tcg/lorcana-cards/cards/008";

describe("MIRABEL MADRIGAL - Curious Child - When you play this character, reveal the top card of your deck.", () => {
  // Effect type(s): reveal, reveal-top-card (alias), reveal-top (alias), reveal-hand, reveal-deck, reveal-and-conditional, reveal-until-match
  //
  // Test cases to cover:
  // 1. reveal-top-card: reveal the top card of the deck to ALL players
  // 2. reveal-hand: reveal a player's entire hand to all players
  // 3. reveal-deck: reveal multiple cards from the deck to all players
  // 4. reveal-and-conditional: reveal a card, then branch based on what was revealed
  // 5. reveal-until-match: reveal cards one by one until a matching card is found
  // 6. Revealed cards are visible to ALL players (public information)
  // 7. Cards not matching in reveal-until-match go to the bottom of the deck
  // 8. Revealing from an empty deck: no card shown, no error

  it.todo("It should make the specified cards visible to all players", () => {});
});
