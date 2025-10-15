import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { oneLastHope } from "./197-one-last-hope";

describe("One Last Hope", () => {
  it.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      play: [oneLastHope],
      hand: [oneLastHope],
    });

    await testEngine.playCard(oneLastHope);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      play: [oneLastHope],
      hand: [oneLastHope],
    });

    await testEngine.playCard(oneLastHope);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
