import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { annaMakingSnowPlans } from "./139-anna-making-snow-plans";

describe("Anna - Making Snow Plans", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(annaMakingSnowPlans, "Support")).toBe(true);
  });
});
