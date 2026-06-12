import { describe, expect, it } from "vite-plus/test";

import {
  BUNDLE_DSL_VERSION,
  DSL_VERSION,
  MIN_SUPPORTED_DSL_VERSION,
  assertCompatibleDsl,
} from "../src/index.ts";

/**
 * The DSL version is a public contract. Bumping it without intent (e.g.,
 * accidentally landing a breaking schema change) would silently desync any
 * external consumer of `@tcg/cyberpunk-cards`. This test pins the version
 * to the integer that should land in main, so changes show up clearly in
 * code review.
 *
 * When intentionally bumping the version, update the expected literal here
 * and document the breaking change per the policy in
 * `packages/types/src/index.ts` (search for `DSL_VERSION`).
 */
describe("DSL version contract", () => {
  it("DSL_VERSION is pinned to the current schema version", () => {
    expect(DSL_VERSION).toBe(1);
  });

  it("MIN_SUPPORTED_DSL_VERSION is at most DSL_VERSION", () => {
    expect(MIN_SUPPORTED_DSL_VERSION).toBeLessThanOrEqual(DSL_VERSION);
    expect(MIN_SUPPORTED_DSL_VERSION).toBeGreaterThanOrEqual(1);
  });

  it("BUNDLE_DSL_VERSION matches DSL_VERSION (the bundle's cards target the current schema)", () => {
    expect(BUNDLE_DSL_VERSION).toBe(DSL_VERSION);
  });

  it("assertCompatibleDsl accepts the current bundle version", () => {
    expect(() => assertCompatibleDsl(BUNDLE_DSL_VERSION)).not.toThrow();
  });

  it("assertCompatibleDsl accepts every version in the supported range", () => {
    for (let v = MIN_SUPPORTED_DSL_VERSION; v <= DSL_VERSION; v++) {
      expect(() => assertCompatibleDsl(v)).not.toThrow();
    }
  });

  it("assertCompatibleDsl rejects versions newer than the engine", () => {
    expect(() => assertCompatibleDsl(DSL_VERSION + 1)).toThrow(/Incompatible card DSL version/);
  });

  it("assertCompatibleDsl rejects versions older than the supported floor", () => {
    expect(() => assertCompatibleDsl(MIN_SUPPORTED_DSL_VERSION - 1)).toThrow(
      /Incompatible card DSL version/,
    );
  });

  it("assertCompatibleDsl rejects non-integer versions", () => {
    expect(() => assertCompatibleDsl(1.5)).toThrow(/Incompatible card DSL version/);
    expect(() => assertCompatibleDsl(Number.NaN)).toThrow(/Incompatible card DSL version/);
  });
});
