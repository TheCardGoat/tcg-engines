import { describe, it } from "bun:test";

describe("Enable Play From Under - Allows playing cards tucked under another card", () => {
  // Effect type(s): enable-play-from-under-effect
  //
  // Test cases to cover:
  // 1. Enables playing a card from under the source card
  // 2. Respects cardType filter (e.g., only characters)
  // 3. "this-turn" duration expires at end of turn
  // 4. Cannot play from under after the enabling card leaves play
  // 5. Ink cost must still be paid for the played card

  it.todo("should enable playing a card from under the source card", () => {});

  it.todo("should respect cardType filter when determining playable cards", () => {});

  it.todo("should expire at end of turn when duration is this-turn", () => {});

  it.todo("should not allow play from under after enabling card leaves play", () => {});

  it.todo("should still require ink cost payment for the played card", () => {});
});
