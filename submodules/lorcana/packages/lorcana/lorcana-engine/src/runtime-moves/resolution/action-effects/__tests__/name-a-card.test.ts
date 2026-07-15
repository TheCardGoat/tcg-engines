import { describe, it } from "bun:test";

/**
 * `name-a-card` is dispatched inline inside `composed-effect-resolver.ts`. It
 * either suspends the effect for a player prompt or, when resolutionInput
 * already carries `namedCard`, finalises the selection by writing to the
 * event snapshot. Suspension semantics are covered by
 * `composed-effect-resolver.test.ts`; simulator tests cover the cards that
 * use this effect.
 */
describe("name-a-card", () => {
  it.todo("unit: add name-a-card coverage once suspension prompts are wrapped by the unit harness");
});
