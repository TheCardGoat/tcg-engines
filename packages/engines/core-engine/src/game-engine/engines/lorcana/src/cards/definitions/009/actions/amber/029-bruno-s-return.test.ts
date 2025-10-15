import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { brunosReturn } from "./029-bruno-s-return";

describe("Bruno's Return", () => {
  it.skip("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: brunosReturn.cost,
      play: [brunosReturn],
      hand: [brunosReturn],
    });

    await testEngine.playCard(brunosReturn);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
