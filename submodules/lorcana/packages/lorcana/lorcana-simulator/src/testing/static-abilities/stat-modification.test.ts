import { describe, it } from "bun:test";

describe("Static Abilities: Stat Modification", () => {
  // Static abilities that continuously modify character stats.
  //
  // Test cases to cover:
  // 1. "Your characters get +1 strength" applies to all friendly characters in play
  // 2. Buff is removed when source card leaves play
  // 3. Multiple static buffs stack additively
  // 4. Self-conditional buff: "While this character has no damage, +2 strength"

  it.todo("should apply stat buff to all friendly characters in play", () => {});

  it.todo("should remove buff when source card leaves play", () => {});

  it.todo("should stack multiple static buffs additively", () => {});

  it.todo("should apply self-conditional buff only while condition is met", () => {});
});
