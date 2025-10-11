import { describe, it } from "bun:test";
import { lookAtThisFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Look At This Family", () => {
  it.skip("**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: lookAtThisFamily.cost,
      play: [lookAtThisFamily],
      hand: [lookAtThisFamily],
    });

    await testEngine.playCard(lookAtThisFamily);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: lookAtThisFamily.cost,
      play: [lookAtThisFamily],
      hand: [lookAtThisFamily],
    });

    await testEngine.playCard(lookAtThisFamily);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
