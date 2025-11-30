import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { fixitFelixJrTrustyBuilder } from "./010-fix-it-felix-jr-trusty-builder";

describe("Fix-It Felix, Jr. - Trusty Builder", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(fixitFelixJrTrustyBuilder)).toBe(true);
  });
});
