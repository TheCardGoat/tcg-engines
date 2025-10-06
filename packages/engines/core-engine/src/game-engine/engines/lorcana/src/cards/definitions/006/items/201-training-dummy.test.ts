/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { trainingDummy } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/items";

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
