import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";

describe("Mulan - Soldier in Training", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [mulanSoldierInTraining],
    });
    const cardUnderTest = testEngine.getCardModel(mulanSoldierInTraining);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
