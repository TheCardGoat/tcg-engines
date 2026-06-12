import { describe, it } from "bun:test";

/**
 * Target-selector `self` is exercised end-to-end by the target-resolver
 * integration test at
 * `../../../runtime-moves/resolution/action-effects/target-resolver.test.ts`,
 * which covers normalization, candidate resolution, and selection bounds.
 * A focused per-selector unit test will land once the runtime resolver is
 * refactored into smaller entry points that can be invoked in isolation.
 */
describe("self", () => {
  it.todo("covered by target-resolver.test.ts (62-case plumbing suite)");
});
