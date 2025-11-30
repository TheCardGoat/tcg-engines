import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

describe("Daisy Duck - Ghost Finder", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(daisyDuckGhostFinder, "Support")).toBe(true);
  });
});
