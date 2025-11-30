import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";

describe("Mulan - Soldier in Training", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mulanSoldierInTraining],
    });

    const cardUnderTest = testEngine.getCardModel(mulanSoldierInTraining);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
