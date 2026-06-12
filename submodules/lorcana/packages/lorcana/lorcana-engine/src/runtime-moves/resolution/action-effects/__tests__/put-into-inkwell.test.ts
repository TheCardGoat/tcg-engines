import { describe, it } from "bun:test";

/**
 * `put-into-inkwell` moves a chosen card from hand or discard to the owner's
 * inkwell, applying the inkwell restriction registry. Inkwell eligibility
 * plumbing is rich enough that a hermetic unit test duplicates most of the
 * simulator integration tests that already cover this variant.
 */
describe("put-into-inkwell", () => {
  it.todo(
    "unit: add put-into-inkwell coverage once inkwell eligibility rules are wrapped by the harness",
  );
});
