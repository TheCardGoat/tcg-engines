import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicCarpetFlyingRug } from "@tcg/lorcana-cards/cards/003";

describe("MAGIC CARPET - Flying Rug - Chosen character can move to a location for free this turn.", () => {
  // Effect type(s): move-to-location, move (alias)
  //
  // Test cases to cover:
  // 1. move-to-location: move a character from anywhere to a chosen location
  // 2. Character must meet the move cost requirements (unless bypassed by effect)
  // 3. Fires the `move` trigger event for the moved character
  // 4. Cannot move to a location not in play
  // 5. Character already at a location: moves from old to new location
  // 6. move alias behaves identically to move-to-location
  // 7. Moving to a location grants any bonuses that location provides
  // 8. Moving for free (bypassing move cost) is distinct from paying the move cost

  it.todo("It should move the chosen character to the specified location", () => {});
});
