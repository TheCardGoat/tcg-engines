import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pinocchioStringsAttached } from "@tcg/lorcana-cards/cards/008";

describe("NO STRINGS ON ME - Pinocchio, Strings Attached - Once during your turn, whenever you ready this character, you may draw a card.", () => {
  // Test cases to cover:
  // 1. Triggers when this character is readied by an effect during your turn
  // 2. Does NOT trigger when opponent readies one of their characters
  // 3. Does NOT trigger at the start of turn when all characters are readied (start-of-turn ready is a different event)
  // 4. Once-per-turn restriction: second ready of this character in the same turn does not trigger
  // 5. Trigger is optional ("you may") — player can decline the draw
  // 6. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 7. Trigger fires when readied by another card's ability (e.g., "ready chosen character")

  it.todo("It should trigger when this character is readied during your turn", () => {});
});
