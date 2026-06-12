import { describe, it } from "bun:test";

/**
 * Target-reference `trigger-subject` resolves at runtime via the target-resolver's
 * reference dispatch in
 * `../../../runtime-moves/resolution/action-effects/target-resolver.test.ts`.
 * Per-reference unit coverage depends on a narrower resolver entry point;
 * in the meantime the integration test suite exercises this variant through
 * simulator flows that rely on previous-target / revealed-first semantics.
 */
describe("trigger-subject", () => {
  it.todo("covered by target-resolver.test.ts + simulator integration");
});
