import { describe, it } from "bun:test";
import { queenOfHeartsWonderlandEmpress } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen of Hearts - Wonderland Empress", () => {
  it.skip("**ALL WAYS HERE ARE MY WAYS** Whenever this character quests, your other Villain characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: queenOfHeartsWonderlandEmpress.cost,
      play: [queenOfHeartsWonderlandEmpress],
      hand: [queenOfHeartsWonderlandEmpress],
    });

    await testEngine.playCard(queenOfHeartsWonderlandEmpress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
