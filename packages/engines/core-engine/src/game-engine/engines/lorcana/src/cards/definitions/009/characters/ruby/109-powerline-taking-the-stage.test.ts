import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { powerlineTakingTheStage } from "./109-powerline-taking-the-stage";

describe("Powerline - Taking the Stage", () => {
  it("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [powerlineTakingTheStage],
    });

    const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
