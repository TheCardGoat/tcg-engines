import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { olafTrustingCompanion } from "./150-olaf-trusting-companion";

describe("Olaf - Trusting Companion", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(olafTrustingCompanion, "Support")).toBe(true);
  });
});
