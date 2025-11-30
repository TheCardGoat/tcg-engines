import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { generalLiHeadOfTheImperialArmy } from "./187-general-li-head-of-the-imperial-army";

describe("General Li - Head of the Imperial Army", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(generalLiHeadOfTheImperialArmy, "Resist")).toBe(true);
  });
});
