import { describe, it } from "bun:test";

describe("Return Random From Inkwell - Returns random cards from inkwell to hand", () => {
  // Effect type(s): return-random-from-inkwell-effect
  //
  // Test cases to cover:
  // 1. Returns the correct number of random cards from inkwell to hand
  // 2. "leave" mode: returns cards until only N remain in inkwell
  // 3. No-op when inkwell is empty
  // 4. Cannot return more cards than exist in inkwell
  // 5. Can target opponent's inkwell via player targeting

  it.todo("should return the specified number of random cards from inkwell to hand", () => {});

  it.todo("should leave only N cards in inkwell when using leave mode", () => {});

  it.todo("should be a no-op when inkwell is empty", () => {});

  it.todo("should cap returns at the number of cards in inkwell", () => {});
});
