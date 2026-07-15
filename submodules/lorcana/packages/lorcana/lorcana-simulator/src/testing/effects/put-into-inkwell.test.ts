import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { kristoffMiningTheRuins } from "@tcg/lorcana-cards/cards/010";

describe("KRISTOFF - Mining the Ruins - When you play this character, you may put a card from your hand into your inkwell facedown, exerted.", () => {
  // Effect type(s): put-into-inkwell, add-to-inkwell (alias), move-to-inkwell, return-random-from-inkwell
  //
  // Test cases to cover:
  // 1. Put a card from hand into the inkwell (card is placed facedown, exerted)
  // 2. add-to-inkwell alias behaves identically to put-into-inkwell
  // 3. move-to-inkwell: moves a card from another zone (e.g., play) to inkwell
  // 4. return-random-from-inkwell: returns a random inkwell card to hand
  // 5. Fires the `ink` / `put-into-inkwell` trigger event
  // 6. Card in inkwell is not the same as playing it (inkwell cards are resources)
  // 7. Cannot put into inkwell if hand is empty (no valid source)

  it.todo("It should move the chosen card from hand to the inkwell, facedown and exerted", () => {});
});
