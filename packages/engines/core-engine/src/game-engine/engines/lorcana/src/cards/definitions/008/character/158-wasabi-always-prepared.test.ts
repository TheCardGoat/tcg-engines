/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { wasabiAlwaysPrepared } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wasabi - Always Prepared", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [wasabiAlwaysPrepared],
    });

    const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
