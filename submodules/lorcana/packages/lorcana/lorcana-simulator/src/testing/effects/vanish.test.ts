import { describe, it } from "bun:test";

describe("Vanish Effect - Banishes characters that were chosen as targets by the vanishing card", () => {
  // Effect type(s): vanish
  //
  // Test cases to cover:
  // 1. Chosen targets are banished when vanish resolves
  // 2. Only characters in the play zone are banished
  // 3. Characters not in play at resolution time are skipped
  // 4. Interaction with Ward: Ward prevents being chosen, so vanish cannot target warded characters

  it.todo("should banish chosen targets when vanish resolves", () => {});

  it.todo("should only banish characters that are still in play at resolution", () => {});

  it.todo("should skip characters that left play before vanish resolves", () => {});

  it.todo("should not be able to target characters with Ward", () => {});
});
