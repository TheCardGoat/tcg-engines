import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rakshaFearlessMother } from "@tcg/lorcana-cards/cards/010";

describe("ON PATROL - Raksha, Fearless Mother - Once during your turn, you may pay 1 {I} less to move this character to a location.", () => {
  // Test cases to cover:
  // 1. Moving Raksha to a location costs 1 less ink during your turn
  // 2. The discount can only be used ONCE per turn (a second move in the same turn pays full cost)
  // 3. Discount applies only to Raksha herself, not to other characters moving to locations
  // 4. During the opponent's turn, the discount is not available
  // 5. Cost cannot be reduced below 0 (minimum 0 ink to move)
  // 6. Discount resets each turn (available again on your next turn)

  it.todo("It should reduce the cost to move this character to a location by 1 once per turn", () => {});
});
