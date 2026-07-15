import { describe, it } from "bun:test";

describe("Put On Bottom - Places cards at the bottom of a deck", () => {
  // Effect type(s): put-on-bottom-effect
  //
  // Test cases to cover:
  // 1. Puts card at bottom position of owner's deck
  // 2. Shifted characters: shift stack cards handled correctly
  // 3. Cards from discard zone trigger leave-discard tracking
  // 4. Multiple targets are placed on bottom in sequence

  it.todo("should place the card at the bottom of the owner's deck", () => {});

  it.todo("should handle shift stack cards when putting a shifted character on bottom", () => {});

  it.todo("should fire leave-discard tracking when card comes from discard", () => {});

  it.todo("should place multiple targets on bottom in sequence", () => {});
});
