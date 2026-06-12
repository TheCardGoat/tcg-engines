import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princePhillipSwordsmanOfTheRealm } from "@tcg/lorcana-cards/cards/005";

describe("PRINCE PHILLIP - Swordsman of the Realm - When you play this character, banish chosen character with 2 strength or less.", () => {
  // Effect type(s): banish
  //
  // Test cases to cover:
  // 1. Banish the chosen character (moves from play to discard zone)
  // 2. Banished character's `banish` and `leave-play` trigger events fire
  // 3. Cannot banish a character that is not in play
  // 4. Banish via effect does NOT fire `banish-in-challenge` (requires challenge context)
  // 5. Banishing a character with cards under it: cards go to discard with the character
  // 6. Targeting filter respected: can only banish characters matching the filter (e.g., strength ≤ 2)
  // 7. Banishing a character at a location: character leaves the location

  it.todo("It should move the chosen character from play to the discard pile", () => {});
});
