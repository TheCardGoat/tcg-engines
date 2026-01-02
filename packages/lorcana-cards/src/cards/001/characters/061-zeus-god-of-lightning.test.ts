import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { zeusGodOfLightning } from "./061-zeus-god-of-lightning";

describe("Zeus - God of Lightning", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zeusGodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(zeusGodOfLightning);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Challenger 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zeusGodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(zeusGodOfLightning);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
