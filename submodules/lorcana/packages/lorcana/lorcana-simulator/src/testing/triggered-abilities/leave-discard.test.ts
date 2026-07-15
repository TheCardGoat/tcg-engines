import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { kristoffIcyExplorer } from "@tcg/lorcana-cards/cards/011";

describe("SLED MASTER - Kristoff, Icy Explorer - Once during your turn, whenever a card leaves your discard, draw a card.", () => {
  // Test cases to cover:
  // 1. Triggers when a card leaves your discard zone (returned to hand, played from discard, put into inkwell from discard)
  // 2. Does NOT trigger when opponent's cards leave their discard (on: YOU)
  // 3. Once-per-turn restriction: only the first leave-discard event triggers, subsequent ones do not
  // 4. Triggers when a card is returned from your discard to your hand via an ability
  // 5. Triggers when a card is played directly from your discard zone
  // 6. The drawn card does NOT trigger this ability again (no loop)
  // 7. Does NOT trigger during opponent's turn (during-your-turn restriction)

  it.todo("It should trigger when a card leaves your discard zone during your turn", () => {});
});
