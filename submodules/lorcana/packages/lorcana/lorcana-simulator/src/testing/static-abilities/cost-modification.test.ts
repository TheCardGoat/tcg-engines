import { describe, it } from "bun:test";

describe("Static Abilities: Cost Modification", () => {
  // Static abilities that modify card play costs.
  //
  // Test cases to cover:
  // 1. Cost reduction applies to matching cards
  // 2. Cost increase applies to matching cards
  // 3. Cost cannot be reduced below 0
  // 4. Multiple cost modifiers stack
  // 5. Type-specific cost modifications (e.g., "actions cost 1 less")

  it.todo("should reduce cost for matching cards", () => {});

  it.todo("should increase cost for matching cards", () => {});

  it.todo("should not reduce cost below 0", () => {});

  it.todo("should stack multiple cost modifiers", () => {});

  it.todo("should apply type-specific cost modifications only to matching card types", () => {});
});
