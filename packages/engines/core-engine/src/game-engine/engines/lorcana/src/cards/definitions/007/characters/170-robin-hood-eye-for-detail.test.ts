/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { robinHoodEyeForDetail } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Robin Hood - Eye for Detail", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [robinHoodEyeForDetail],
    });

    const cardUnderTest = testEngine.getCardModel(robinHoodEyeForDetail);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
