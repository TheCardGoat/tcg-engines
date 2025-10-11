import { describe, expect, it } from "bun:test";
import { trustyLoyalBloodhound } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Trusty - Loyal Bloodhound", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [trustyLoyalBloodhound],
    });

    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
