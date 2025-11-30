import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { shantiVillageGirl } from "./013-shanti-village-girl";

describe("Shanti - Village Girl", () => {
  it("should have Singer 5 ability", () => {
    expect(hasKeyword(shantiVillageGirl, "Singer")).toBe(true);
  });
});
