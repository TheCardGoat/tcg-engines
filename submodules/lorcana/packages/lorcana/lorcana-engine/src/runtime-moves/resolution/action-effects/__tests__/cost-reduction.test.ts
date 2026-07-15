import { describe, it } from "bun:test";

/**
 * `cost-reduction` mutates per-turn cost reduction registries whose shape is
 * maintained by the full engine state builder. Direct per-variant unit
 * coverage would duplicate the registry plumbing; for now the variant's
 * behaviour is exercised end-to-end via simulator tests that play cards
 * whose printed text reduces the cost of the next play.
 */
describe("cost-reduction", () => {
  it.todo(
    "unit: add focused cost-reduction coverage once the registry plumbing is wrapped by the unit harness",
  );
});
