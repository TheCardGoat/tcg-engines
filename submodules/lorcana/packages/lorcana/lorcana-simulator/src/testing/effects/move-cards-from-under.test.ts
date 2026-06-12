import { describe, it } from "bun:test";

describe("Move Cards From Under - Moves cards tucked under one card to another destination", () => {
  // Effect type(s): move-cards-from-under-effect
  //
  // Test cases to cover:
  // 1. Moves cards from under source to under a different target card
  // 2. Moves cards from under source to a zone (hand, deck, discard)
  // 3. Parent card's cardsUnder metadata is updated correctly after removal
  // 4. No-op when source has no cards under it
  // 5. Shuffle behavior when moving cards to deck

  it.todo("should move cards from under source to under a different target", () => {});

  it.todo("should move cards from under source to a specified zone", () => {});

  it.todo("should update the parent card's cardsUnder metadata after removal", () => {});

  it.todo("should be a no-op when source has no cards under it", () => {});
});
