import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { powerlineTakingTheStage } from "./109-powerline-taking-the-stage";

describe("Powerline - Taking the Stage", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [powerlineTakingTheStage],
      },
    );

    const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
