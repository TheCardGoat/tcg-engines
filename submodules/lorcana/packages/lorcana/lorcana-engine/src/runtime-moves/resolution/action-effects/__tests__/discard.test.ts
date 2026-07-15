import { describe, it } from "bun:test";

/**
 * Deeper coverage for `discard` lives in the sibling `discard-effect.test.ts`
 * file next to the resolver. The discard resolver suspends for chooser
 * decisions; the suspension plumbing is easier to exercise via the
 * full-engine test harness.
 */
describe("discard", () => {
  it.todo(
    "unit: add discard coverage once suspension plumbing is in the harness (see discard-effect.test.ts for integration)",
  );
});
