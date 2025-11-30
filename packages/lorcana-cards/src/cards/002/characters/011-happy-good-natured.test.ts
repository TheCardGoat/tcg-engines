import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Happy - Good-Natured", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(happyGoodnatured, "Support")).toBe(true);
  });
});
