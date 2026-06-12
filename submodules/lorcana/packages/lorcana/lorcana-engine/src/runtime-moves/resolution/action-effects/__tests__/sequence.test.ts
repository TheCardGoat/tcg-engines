import { describe, it } from "bun:test";

/**
 * `sequence` threads multiple child effects, carrying over target selections
 * and event-snapshot state between steps. Coverage of the sequence machinery
 * lives in `../composed-effect-resolver.test.ts`; per-variant unit coverage
 * would duplicate that file's selection-context tests.
 */
describe("sequence", () => {
  it.todo(
    "covered by composed-effect-resolver.test.ts — leave as pointer until a narrower unit contract is defined",
  );
});
