import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { zeusgodOfLightning } from "./061-zeus-god-of-lightning";

describe("Zeus - God of Lightning", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zeusgodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(zeusgodOfLightning);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Challenger 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zeusgodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(zeusgodOfLightning);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
