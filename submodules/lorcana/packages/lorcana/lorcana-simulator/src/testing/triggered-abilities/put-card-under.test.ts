import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jiminyCricketGhostOfChristmasPast } from "@tcg/lorcana-cards/cards/011";

describe("A LITTLE KNOWLEDGE - Jiminy Cricket, Ghost of Christmas Past - Whenever you put a card under this character, you may put the top card of your deck under them facedown and exerted.", () => {
  // Test cases to cover:
  // 1. Triggers each time a card is placed under this character
  // 2. Does NOT trigger when a card is placed under another character
  // 3. Trigger is optional ("you may") — player can decline
  // 4. The card placed under by the trigger does NOT itself re-trigger (no loop)
  // 5. Fires regardless of how the card was placed (ability, effect, etc.)
  // 6. Deck must have at least 1 card for the trigger effect to execute
  // 7. Card placed under by the effect is facedown and exerted (as specified)

  it.todo("It should trigger when a card is placed under this character", () => {});
});
