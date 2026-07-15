import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckPieSlinger } from "@tcg/lorcana-cards/cards/005";

describe("DONALD DUCK - Pie Slinger - Chosen opponent loses 1 lore.", () => {
  // Effect type(s): lose-lore, lore-loss (alias)
  //
  // Test cases to cover:
  // 1. Lose N lore (decrements the target player's lore counter)
  // 2. Cannot drop below 0 lore (clamps to minimum 0)
  // 3. lore-loss alias behaves identically to lose-lore
  // 4. Fires the `lose-lore` trigger event
  // 5. controller filter: lore is lost from the correct player
  // 6. Amount: fixed (lose 1) vs dynamic expression
  // 7. Losing lore does NOT trigger a win condition check

  it.todo("It should decrement the target player's lore by the specified amount", () => {});
});
