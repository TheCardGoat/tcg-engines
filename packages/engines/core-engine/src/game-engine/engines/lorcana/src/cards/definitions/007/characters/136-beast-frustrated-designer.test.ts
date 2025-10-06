/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { beastFrustratedDesigner } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beast - Frustrated Designer", () => {
  it.skip("I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: beastFrustratedDesigner.cost,
      play: [beastFrustratedDesigner],
      hand: [beastFrustratedDesigner],
    });

    await testEngine.playCard(beastFrustratedDesigner);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
