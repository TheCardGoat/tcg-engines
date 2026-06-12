import { describe, it } from "bun:test";

describe("Support Effect - Adds supporter's strength as willpower to target", () => {
  // Effect type(s): support-effect
  //
  // Test cases to cover:
  // 1. Target gains willpower equal to supporter's effective strength
  // 2. Strength modifiers on supporter affect the support amount
  // 3. Fires support triggered event
  // 4. Continuous willpower effect expires at end of turn

  it.todo("should grant willpower equal to supporter's effective strength", () => {});

  it.todo("should use modified strength when supporter has stat buffs", () => {});

  it.todo("should fire the support triggered event", () => {});

  it.todo("should expire the willpower buff at end of turn", () => {});
});
