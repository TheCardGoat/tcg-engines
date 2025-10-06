/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { powerlineTakingTheStage } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Powerline - Taking the Stage", () => {
  it("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [powerlineTakingTheStage],
    });

    const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
