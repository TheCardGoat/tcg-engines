import { describe, it } from "bun:test";
import { beOurGuest } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Be Our Guest", () => {
  it.skip("Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: beOurGuest.cost,
      play: [beOurGuest],
      hand: [beOurGuest],
    });

    await testEngine.playCard(beOurGuest);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
