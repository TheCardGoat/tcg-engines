import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { merlinShapeshifter } from "@tcg/lorcana-cards/cards/002";

describe("TURN INTO A CATERPILLAR - Merlin, Shapeshifter - Whenever one of your other characters is returned to your hand from play, this character gets +1 Lore this turn.", () => {
  // Test cases to cover:
  // 1. Triggers when one of your OTHER characters is returned to hand from play
  // 2. Does NOT trigger when Merlin himself is returned to hand (on: YOUR_OTHER_CHARACTERS)
  // 3. Does NOT trigger when an opponent's character is returned to their hand
  // 4. Lore buff (+1) stacks if multiple characters are bounced in the same turn
  // 5. Buff lasts only for the current turn (expires at end of turn)
  // 6. Triggers regardless of what caused the return (opponent's bounce, own ability, etc.)
  // 7. Does NOT trigger when a character is returned to hand from the discard zone (must be "from play")

  it.todo("It should trigger when one of your other characters is returned to hand from play", () => {});
});
