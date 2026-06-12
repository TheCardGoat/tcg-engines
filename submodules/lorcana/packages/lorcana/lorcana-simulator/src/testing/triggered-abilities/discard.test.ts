import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princeJohnGreediestOfAll } from "@tcg/lorcana-cards/cards/002";

describe("GOLDEN OPPORTUNITY - Prince John, Greediest of All - Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.", () => {
  // Test cases to cover:
  // 1. Triggers when opponent discards one card
  // 2. Triggers when opponent discards multiple cards at once (draw 1 per card discarded)
  // 3. Does NOT trigger when you discard your own cards (on: OPPONENT)
  // 4. Trigger is optional ("you may") — player can decline the draw
  // 5. Triggers when opponent discards due to hand-size limit at end of turn
  // 6. Triggers when opponent discards due to a card effect targeting them
  // 7. Discarding from a random discard effect (e.g. discard at random) still triggers

  it.todo("It should trigger when opponent discards a card", () => {});
});
