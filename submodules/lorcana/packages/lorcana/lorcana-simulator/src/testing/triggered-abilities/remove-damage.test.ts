import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraWakingBeauty } from "@tcg/lorcana-cards/cards/007";

describe("HEALING SLEEP - Aurora, Waking Beauty - Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.", () => {
  // Test cases to cover:
  // 1. Triggers when damage is removed from any character you control
  // 2. Does NOT trigger if no damage was actually removed (removing 0 damage)
  // 3. Triggers once per remove-damage event, even if multiple damage counters are removed at once
  // 4. Character is readied but immediately restricted from questing and challenging this turn
  // 5. Restriction expires at the end of the turn
  // 6. Can trigger multiple times in a turn if multiple heal effects are used
  // 7. Does NOT trigger when opponent removes damage from their characters (on: YOUR_CHARACTERS or YOU)

  it.todo("It should trigger when you remove damage from a character", () => {});
});
