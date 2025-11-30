import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { gazellePopStar } from "./011-gazelle-pop-star";

describe("Gazelle - Pop Star", () => {
  it("should have Singer 5 ability", () => {
    expect(hasKeyword(gazellePopStar, "Singer")).toBe(true);
  });
});
