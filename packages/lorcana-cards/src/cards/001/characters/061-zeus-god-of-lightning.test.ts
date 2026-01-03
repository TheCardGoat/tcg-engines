import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ZeusGodOfLightning } from "./061-zeus-god-of-lightning";

describe("Zeus - God of Lightning", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ZeusGodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(ZeusGodOfLightning);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Challenger 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ZeusGodOfLightning],
    });

    const cardUnderTest = testEngine.getCardModel(ZeusGodOfLightning);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
