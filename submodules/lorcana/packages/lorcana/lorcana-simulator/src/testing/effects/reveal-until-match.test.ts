import { describe, it } from "bun:test";

describe("Reveal Until Match - Reveals cards from deck until finding one matching a filter", () => {
  // Effect type(s): reveal-until-match-effect
  //
  // Test cases to cover:
  // 1. Reveals cards until a matching cardType is found
  // 2. Classification filter matches correctly (e.g., "Floodborn")
  // 3. Song subtype filter matches action cards with song subtype
  // 4. All revealed non-matching cards go to the appropriate zone (typically bottom of deck)
  // 5. No match in entire deck: all cards revealed, none moved to hand

  it.todo("should reveal cards until a matching card is found", () => {});

  it.todo("should respect classification filter when matching", () => {});

  it.todo("should send non-matching revealed cards to the correct zone", () => {});

  it.todo("should handle no match in entire deck gracefully", () => {});
});
