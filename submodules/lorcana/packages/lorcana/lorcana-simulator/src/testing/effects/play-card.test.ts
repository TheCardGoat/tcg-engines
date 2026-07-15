import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princeJohnGoldLover } from "@tcg/lorcana-cards/cards/005";

describe("PRINCE JOHN - Gold Lover - When you play this character, you may play a character with cost 3 or less for free.", () => {
  // Effect type(s): play-card, play-for-free
  //
  // Test cases to cover:
  // 1. play-card: play a card from hand, deck, or discard into the appropriate zone
  // 2. play-for-free: play without paying ink cost (bypasses normal ink payment)
  // 3. Cost filter: "play a card with cost 4 or less" — cards above the limit cannot be chosen
  // 4. Card type filter: "play a character card" — other types cannot be chosen
  // 5. Fires the `play` trigger event for the played card
  // 6. The played card's own "when played" trigger fires after it enters play
  // 7. Cannot play a card for free if no matching card is available
  // 8. play-for-free does NOT bypass other restrictions (e.g., can't play if already played this turn)

  it.todo("It should play the chosen card without paying its ink cost", () => {});
});
