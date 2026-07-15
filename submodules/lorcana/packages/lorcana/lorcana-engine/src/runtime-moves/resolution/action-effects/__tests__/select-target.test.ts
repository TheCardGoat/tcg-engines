import { describe, it } from "bun:test";

/**
 * `select-target` is a pre-selection step that caches the chosen targets in
 * the resolution selection context so later steps can reference them via
 * `reference: "selected-first"` / `"selected-all"`. Coverage lives in
 * `../selection-context.test.ts`.
 */
describe("select-target", () => {
  it.todo("covered by selection-context.test.ts");
});
