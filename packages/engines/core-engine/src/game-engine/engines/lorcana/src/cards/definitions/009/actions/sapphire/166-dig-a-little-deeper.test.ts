/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { digALittleDeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dig A Little Deeper", () => {
  it.skip("**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: digALittleDeeper.cost,
      play: [digALittleDeeper],
      hand: [digALittleDeeper],
    });

    await testEngine.playCard(digALittleDeeper);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: digALittleDeeper.cost,
      play: [digALittleDeeper],
      hand: [digALittleDeeper],
    });

    await testEngine.playCard(digALittleDeeper);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
