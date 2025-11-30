import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { crikeeGoodLuckCharm } from "./142-cri-kee-good-luck-charm";

describe("Cri-Kee - Good Luck Charm", () => {
  it("should have Alert ability", () => {
    expect(hasKeyword(crikeeGoodLuckCharm, "Alert")).toBe(true);
  });
});
