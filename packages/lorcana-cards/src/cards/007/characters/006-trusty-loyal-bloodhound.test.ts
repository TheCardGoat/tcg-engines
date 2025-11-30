import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { trustyLoyalBloodhound } from "./006-trusty-loyal-bloodhound";

describe("Trusty - Loyal Bloodhound", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(trustyLoyalBloodhound, "Support")).toBe(true);
  });
});
