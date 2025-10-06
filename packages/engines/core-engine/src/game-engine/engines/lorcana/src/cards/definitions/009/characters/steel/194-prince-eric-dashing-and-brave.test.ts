/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princeEricDashingAndBrave } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Eric - Dashing and Brave", () => {
  it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", async () => {
    const testEngine = new TestEngine({
      play: [princeEricDashingAndBrave],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricDashingAndBrave);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
