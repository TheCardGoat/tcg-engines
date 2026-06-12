import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cinderellaGentleAndKind } from "@tcg/lorcana-cards/cards/001";

describe("CINDERELLA - Gentle and Kind - When you play this character, remove up to 3 damage from chosen character.", () => {
  // Effect type(s): remove-damage, heal (alias)
  //
  // Test cases to cover:
  // 1. Remove N damage from chosen character (damage counters removed)
  // 2. upTo: true — can remove fewer if character has less damage than the amount
  // 3. Removing more damage than a character has: removes all existing damage (clamps to 0)
  // 4. heal alias behaves identically to remove-damage
  // 5. Fires the `remove-damage` trigger event
  // 6. Removing damage does NOT cause any banish check
  // 7. Removing damage from a character with 0 damage: no-op, no error

  it.todo("It should remove the specified amount of damage from the chosen character", () => {});
});
