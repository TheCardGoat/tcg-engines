import { describe, it } from "bun:test";

describe("Draw Until Hand Size - Draws cards until a target hand size is reached", () => {
  // Effect type(s): draw-until-hand-size-effect
  //
  // Test cases to cover:
  // 1. Draws the correct number of cards to reach target hand size
  // 2. Does not draw if hand is already at or above target size
  // 3. Stops drawing if deck runs out before reaching target size
  // 4. Can target opponent via player targeting

  it.todo("should draw cards until hand reaches the target size", () => {});

  it.todo("should not draw if hand is already at or above target size", () => {});

  it.todo("should stop drawing when deck is exhausted before reaching target", () => {});

  it.todo("should target opponent's hand when configured", () => {});
});
