import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { megaraSecretKeeper } from "@tcg/lorcana-cards/cards/010";

describe("MEGARA - Secret Keeper - When you play this character, each opponent discards a card.", () => {
  // Effect type(s): discard, discard-until
  //
  // Test cases to cover:
  // 1. Discard a specific card (chosen by the discarding player)
  // 2. Discard at random: engine selects randomly from hand
  // 3. discard-until: discard cards until condition is met (e.g., until hand size ≤ 7)
  // 4. Discarding from an empty hand: no error, discards 0 cards
  // 5. Fires the `discard` trigger event for each discarded card
  // 6. controller filter: forced discard applies to the correct player
  // 7. Discard of a specific card type or name (filtered discard)
  // 8. Discarding an inked card removes it from the inkwell first

  it.todo("It should move the chosen card from hand to the discard pile", () => {});
});
