import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { todKnowsAllTheTricks } from "@tcg/lorcana-cards/cards/011";

describe("SIDESTEPPER - Tod, Knows All the Tricks - Twice during your turn, whenever this character is chosen for an action or an item's ability, you may ready him.", () => {
  // Test cases to cover:
  // 1. Triggers when this character is chosen as a target for an action card
  // 2. Triggers when this character is chosen as a target for an item's activated ability
  // 3. Does NOT trigger when chosen by your own actions (sourceController filter may restrict)
  // 4. n-times-per-turn (2) restriction: fires at most twice per turn, third time does not trigger
  // 5. Trigger is optional ("you may") — player can decline the ready
  // 6. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 7. Does NOT trigger when chosen for a character ability (only actions and items)
  // 8. Counter resets at the start of each new turn

  it.todo("It should trigger when this character is chosen for an action or item ability", () => {});
});
