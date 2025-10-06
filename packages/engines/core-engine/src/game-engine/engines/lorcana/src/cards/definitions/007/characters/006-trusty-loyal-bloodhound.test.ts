/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { trustyLoyalBloodhound } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Trusty - Loyal Bloodhound", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [trustyLoyalBloodhound],
    });

    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
