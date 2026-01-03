import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { shantiVillageGirl } from "./013-shanti-village-girl";

describe("Shanti - Village Girl", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [shantiVillageGirl],
    });

    const cardUnderTest = testEngine.getCardModel(shantiVillageGirl);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
