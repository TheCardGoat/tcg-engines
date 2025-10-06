/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { wasabiAlwaysPrepared } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Wasabi - Always Prepared", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [wasabiAlwaysPrepared],
    });

    const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
