/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { trustyLoyalBloodhound } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Trusty - Loyal Bloodhound", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [trustyLoyalBloodhound],
    });

    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
