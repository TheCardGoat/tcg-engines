import { describe, it } from "bun:test";

describe("Additional Inkwell - Grants extra ink-placing actions per turn", () => {
  // Effect type(s): additional-inkwell-effect
  //
  // Test cases to cover:
  // 1. Player can ink a second card after this effect resolves
  // 2. Multiple additional-inkwell effects stack (e.g., 2 grants = 3 total inks)
  // 3. Unused additional inkwell actions do not carry over to the next turn
  // 4. Effect respects card inkability rules (non-inkable cards still cannot be inked)
  // 5. Amount defaults to 1 when not specified

  it.todo("should allow the player to ink a second card in the same turn", () => {});

  it.todo("should stack when multiple additional-inkwell effects resolve", () => {});

  it.todo("should not carry unused extra inks over to the next turn", () => {});

  it.todo("should still prevent inking non-inkable cards", () => {});
});
