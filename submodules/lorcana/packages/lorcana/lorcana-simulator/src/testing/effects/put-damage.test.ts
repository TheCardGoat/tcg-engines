import { describe, it } from "bun:test";

describe("Put Damage - Places damage counters (not dealt damage; still 'take damage' for replacements)", () => {
  // Effect type(s): put-damage-effect
  //
  // Put damage is not "dealt" damage (FAQ: no Resist, no "whenever deals damage" triggers).
  // Per comprehensive rules 1.9.1.5, characters still "take damage" when counters are put on them,
  // so printed prevent-damage (e.g. Lilo – Bundled Up EXTRA LAYERS) applies — see THE-988 regression.
  //
  // Test cases to cover:
  // 1. Puts the specified amount of damage on the target character
  // 2. Runs prevent-damage replacement effects for the put amount (Extra Layers, etc.)
  // 3. Does NOT reduce damage via Resist keyword (unlike deal-damage)
  // 4. Banishes character if damage equals or exceeds willpower
  // 5. Works with amountByTarget for distributing damage across multiple targets

  it.todo("should put the specified damage on the target character", () => {});

  it.todo("should apply prevent-damage replacements to put damage per rules 1.9.1.5", () => {});

  it.todo("should NOT reduce put damage via Resist keyword", () => {});

  it.todo("should banish character when damage meets or exceeds willpower", () => {});

  it.todo("should distribute damage across targets via amountByTarget", () => {});
});
