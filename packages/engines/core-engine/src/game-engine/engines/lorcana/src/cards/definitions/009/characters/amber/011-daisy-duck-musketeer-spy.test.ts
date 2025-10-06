/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { daisyDuckMusketeerSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
