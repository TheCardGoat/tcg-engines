import { describe, it } from "bun:test";

/**
 * Deeper coverage for `banish` lives in the sibling `banish-effect.test.ts`
 * file next to the resolver (uses LorcanaMultiplayerTestEngine). Per-variant
 * unit coverage is deferred until moveCardOutOfPlayWithStack is wrapped by
 * the unit harness.
 */
describe("banish", () => {
  it.todo(
    "unit: add banish coverage once move-out-of-play is in the harness (see banish-effect.test.ts for integration)",
  );
});
