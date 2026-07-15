import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Mill effect - an effect that puts cards from a deck into the discard pile", () => {
  // Effect type(s): mill
  //
  // Test cases to cover:
  // 1. Mill N cards from the top of a player's deck to their discard
  // 2. Mill from an empty deck: no error, mills as many as available (0)
  // 3. Mill partially filled deck: mills only available cards
  // 4. Milled cards fire zone-change events (deck → discard)
  // 5. Mill does NOT draw (cards go to discard, not hand)
  // 6. controller filter: mill applies to the correct player (self or opponent)
  // 7. Mill amount: fixed (mill 3) vs dynamic expression

  it.todo("It should move the specified number of cards from the deck to the discard pile", () => {});
});
