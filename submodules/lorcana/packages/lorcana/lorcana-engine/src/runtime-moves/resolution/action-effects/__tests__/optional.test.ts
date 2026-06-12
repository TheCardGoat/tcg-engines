import { describe, it } from "bun:test";

/**
 * `optional` wraps a child effect behind a "may" prompt. The suspend →
 * resolve path is covered in `../composed-effect-resolver.test.ts` and
 * simulator tests covering "You may" abilities.
 */
describe("optional", () => {
  it.todo("covered by composed-effect-resolver.test.ts + simulator integration");
});
