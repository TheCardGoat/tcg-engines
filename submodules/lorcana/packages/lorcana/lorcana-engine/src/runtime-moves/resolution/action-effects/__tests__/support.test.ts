import { describe, it } from "bun:test";

/**
 * `support` depends on `getEffectiveStrength` via the registry-backed derived
 * state projection. A fully hermetic unit test would require standing up the
 * move registry — simulator integration tests (e.g. cards with Support)
 * exercise this resolver end-to-end today.
 */
describe("support", () => {
  it.todo("unit: add support coverage once the registry-backed harness is available");
});
