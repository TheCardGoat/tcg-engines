import { describe, it } from "bun:test";
import { trainingDummy } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Training Dummy", () => {
  it.skip("HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      inkwell: trainingDummy.cost,
      play: [trainingDummy],
      hand: [trainingDummy],
    });

    await testEngine.playCard(trainingDummy);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
