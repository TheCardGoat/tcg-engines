import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "./180-goofy-knight-for-a-day";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";
import { peterPansShadowNotSewnOn } from "./055-peter-pans-shadow-not-sewn-on";

describe("Peter Pan's Shadow - Not Sewn On", () => {
  it("gives your other Rush characters Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peterPansShadowNotSewnOn, mulanSoldierInTraining, goofyKnightForADay],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().hasKeyword(mulanSoldierInTraining, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(goofyKnightForADay, "Evasive")).toBe(false);
  });
});
