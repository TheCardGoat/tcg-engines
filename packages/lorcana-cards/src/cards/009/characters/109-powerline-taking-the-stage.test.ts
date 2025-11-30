import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { powerlineTakingTheStage } from "./109-powerline-taking-the-stage";

describe("Powerline - Taking the Stage", () => {
  it.skip("should have Singer 4 ability", () => {
    const testEngine = new TestEngine({
      play: [powerlineTakingTheStage],
    });

    const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
