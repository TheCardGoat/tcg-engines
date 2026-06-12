import { describe, it } from "bun:test";

/**
 * `conditional` evaluates its embedded condition and routes to either the
 * `then` or `else` child effect. The action-level condition evaluator is
 * unit-tested in `../action-condition-evaluator.test.ts`; branch dispatch
 * is exercised via `../composed-effect-resolver.test.ts`.
 */
describe("conditional", () => {
  it.todo("covered by action-condition-evaluator.test.ts + composed-effect-resolver.test.ts");
});
