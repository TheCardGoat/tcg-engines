import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalCuriousChild } from "@tcg/lorcana-cards/cards/008";

describe("MIRABEL MADRIGAL - Curious Child - Select a target to use in subsequent effects.", () => {
  // Effect type(s): select-target
  //
  // Test cases to cover:
  // 1. select-target: player selects a target that is stored in context for later effects
  // 2. The selected target is accessible by subsequent effects in the sequence
  // 3. Invalid targets cannot be selected (engine enforces targeting rules at selection time)
  // 4. Used as a setup step before a conditional or other dependent effect
  // 5. If no valid targets exist, the select-target step (and dependent effects) are skipped
  // 6. Selecting an opponent's character: target is correctly identified as enemy
  // 7. Target remains in context even after zone changes within the same resolution

  it.todo("It should store the selected target in context for use by subsequent effects", () => {});
});
