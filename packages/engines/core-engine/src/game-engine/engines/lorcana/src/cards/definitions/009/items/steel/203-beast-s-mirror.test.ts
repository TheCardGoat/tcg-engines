import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { beastsMirror } from "./203-beast-s-mirror";

describe("Beast's Mirror", () => {
  it.skip("**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: beastsMirror.cost,
      play: [beastsMirror],
      hand: [beastsMirror],
    });

    await testEngine.playCard(beastsMirror);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
