/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { thePrinceChallengerOfTheRise } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("The Prince - Challenger of the Rise", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [thePrinceChallengerOfTheRise],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceChallengerOfTheRise);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
