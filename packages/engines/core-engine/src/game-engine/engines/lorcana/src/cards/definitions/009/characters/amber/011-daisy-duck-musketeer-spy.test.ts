/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { daisyDuckMusketeerSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Daisy Duck - Musketeer Spy", () => {
  it.skip("INFILTRATION When you play this character, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: daisyDuckMusketeerSpy.cost,
      hand: [daisyDuckMusketeerSpy],
    });

    await testEngine.playCard(daisyDuckMusketeerSpy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
