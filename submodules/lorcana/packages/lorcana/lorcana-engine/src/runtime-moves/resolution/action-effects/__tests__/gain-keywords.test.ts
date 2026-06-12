import { describe, it } from "bun:test";

/**
 * gain-keywords is an inline resolver in composed-effect-resolver.ts that
 * iterates over `effect.keywords` and delegates to the gain-keyword resolver
 * for each item. The per-keyword behaviour is covered in `gain-keyword.test.ts`.
 * Cross-variant looping is covered in
 * `composed-effect-resolver.test.ts` and via simulator integration tests, so
 * this file intentionally mirrors the single-variant contract only.
 */
describe("gain-keywords", () => {
  it.todo("integration: composed-effect-resolver.test.ts covers the loop behaviour");
});
