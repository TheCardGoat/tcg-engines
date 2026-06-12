import { describe, it } from "bun:test";

/**
 * `for-each-opponent` applies a child effect once per opposing player.
 * Standalone resolver lives in `../for-each-opponent-effect.ts`; coverage
 * through `../composed-effect-resolver.test.ts` already exercises the
 * multi-player iteration.
 */
describe("for-each-opponent", () => {
  it.todo("covered by composed-effect-resolver.test.ts");
});
