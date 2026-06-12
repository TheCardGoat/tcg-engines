import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Put under effect - an effect that places cards under a character or location (Boost mechanic)", () => {
  // Effect type(s): put-under, put-card-under (alias), move-cards-from-under, enable-play-from-under
  //
  // Test cases to cover:
  // 1. put-under: place a card under a chosen character or location
  // 2. put-card-under alias behaves identically
  // 3. move-cards-from-under: move some or all cards out from under a character
  // 4. enable-play-from-under: allows cards under a character to be played (Boost mechanic)
  // 5. Cards placed under are facedown (hidden from opponent) unless specified otherwise
  // 6. Fires the `put-card-under` trigger event
  // 7. When the character is banished, cards under it follow to discard

  it.todo("It should place the specified card under the chosen character", () => {});
});
