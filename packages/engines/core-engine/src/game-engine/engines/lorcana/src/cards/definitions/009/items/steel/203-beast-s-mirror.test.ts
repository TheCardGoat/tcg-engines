/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { beastsMirror } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
