import { describe, it } from "bun:test";

describe("Shuffle Into Deck - Shuffles cards into a player's deck", () => {
  // Effect type(s): shuffle-into-deck-effect
  //
  // Test cases to cover:
  // 1. Moves target card from play into deck and shuffles
  // 2. Shifted characters: handles shift stack correctly
  // 3. Card from play triggers leave-play events
  // 4. Cards from discard are tracked for leave-discard

  it.todo("should move target card from play into deck and shuffle", () => {});

  it.todo("should handle shift stack when shuffling a shifted character into deck", () => {});

  it.todo("should trigger leave-play events when card moves from play", () => {});
});
