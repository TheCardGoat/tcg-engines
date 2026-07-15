import { describe, it } from "bun:test";

/**
 * `put-on-bottom` calls `ctx.framework.log` and the `moveCardOutOfPlayWithStack`
 * primitive. Both require framework plumbing that the unit harness does not
 * currently model; simulator integration tests cover this variant
 * end-to-end.
 */
describe("put-on-bottom", () => {
  it.todo(
    "unit: add put-on-bottom coverage once framework.log + stack primitives are in the harness",
  );
});
