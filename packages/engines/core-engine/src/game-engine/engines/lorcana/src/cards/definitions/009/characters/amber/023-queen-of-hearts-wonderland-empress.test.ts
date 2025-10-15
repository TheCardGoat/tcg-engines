import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { queenOfHeartsWonderlandEmpress } from "./023-queen-of-hearts-wonderland-empress";

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
