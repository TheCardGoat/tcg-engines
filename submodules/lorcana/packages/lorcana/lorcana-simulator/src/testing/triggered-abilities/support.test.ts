import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rapunzelReadyForAdventure } from "@tcg/lorcana-cards/cards/010";

describe("Support trigger - Rapunzel, Ready for Adventure", () => {
  // Test cases to cover:
  // 1. Trigger fires when the Support keyword ability is used (character exerts to give +Strength)
  // 2. Does NOT trigger when a different character uses Support
  // 3. Trigger fires once per Support use, not for each strength point given
  // 4. Does NOT trigger during opponent's turn if there is a turn restriction
  // 5. Effect from the trigger resolves after the Support strength bonus is applied
  // 6. Support must target a valid (ready) character — cannot support if no valid target

  it.todo("It should trigger when this character uses the Support keyword", () => {});
});
