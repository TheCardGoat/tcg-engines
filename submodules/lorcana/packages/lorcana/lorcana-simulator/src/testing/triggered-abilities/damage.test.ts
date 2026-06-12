import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { captainHookThePirateKing } from "@tcg/lorcana-cards/cards/008";

describe("PIRATE KING - Captain Hook, The Pirate King - Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 Strength and gain Resist +2 this turn.", () => {
  // Test cases to cover:
  // 1. Triggers when an opposing character takes damage during your turn
  // 2. Does NOT trigger when one of your own characters takes damage
  // 3. Once-per-turn restriction: second damage event to an opposing character does not trigger again
  // 4. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 5. Buff applies to ALL Pirate characters you control, not just the one that dealt damage
  // 6. Buff lasts only for the current turn (expires at end of turn)
  // 7. Triggers from challenge damage, action card damage, and ability damage

  it.todo("It should trigger when an opposing character is damaged during your turn", () => {});
});
