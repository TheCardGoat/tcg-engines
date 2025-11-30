import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { beastThickskinned } from "./176-beast-thick-skinned";

describe("Beast - Thick-Skinned", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(beastThickskinned, "Resist")).toBe(true);
  });
});
