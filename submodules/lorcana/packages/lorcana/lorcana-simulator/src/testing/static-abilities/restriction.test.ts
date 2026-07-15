import { describe, it } from "bun:test";

describe("Static Abilities: Restrictions", () => {
  // Static abilities that impose restrictions on game actions.
  //
  // Test cases to cover:
  // 1. "This character can't quest" prevents the character from questing
  // 2. "This character can't be challenged" prevents opponents from challenging it
  // 3. "Characters can't be challenged while here" (location-based restriction)
  // 4. Restriction is removed when the source card leaves play
  // 5. Conditional restriction: only active while a condition is met (e.g., "while you have 3+ characters")

  it.todo("should prevent questing when 'can't quest' restriction is active", () => {});

  it.todo("should prevent opponents from challenging when 'can't be challenged' is active", () => {});

  it.todo("should apply location-based restrictions to characters at that location", () => {});

  it.todo("should remove restriction when source card leaves play", () => {});

  it.todo("should only apply conditional restriction while condition is met", () => {});
});
