import { describe, it } from "bun:test";

/**
 * `return-to-hand` calls `moveCardOutOfPlayWithStack`, which requires the
 * framework's stack-tracking primitives. Detailed coverage lives in
 * simulator integration tests around cards that return characters to hand
 * (e.g. "The Queen - Regal Monarch").
 */
describe("return-to-hand", () => {
  it.todo("unit: add return-to-hand coverage once stack tracking is part of the unit harness");
});
