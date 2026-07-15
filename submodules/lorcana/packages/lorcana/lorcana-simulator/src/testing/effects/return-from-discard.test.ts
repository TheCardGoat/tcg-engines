import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { partOfYourWorld } from "@tcg/lorcana-cards/cards/001";

describe("PART OF YOUR WORLD - Return a character card from your discard pile to your hand.", () => {
  // Effect type(s): return-from-discard
  //
  // Test cases to cover:
  // 1. Return a card from your discard pile to your hand
  // 2. Fires `leave-discard` trigger event
  // 3. Cannot return from an empty discard (no valid targets)
  // 4. filter: can specify card type, name, or classification restrictions
  // 5. Does NOT play the card (just moves to hand, player must play it separately)
  // 6. controller filter: returns to the correct player's hand
  // 7. Multiple matching cards in discard: player chooses which one to return

  it.todo("It should move the chosen card from the discard pile to the player's hand", () => {});
});
