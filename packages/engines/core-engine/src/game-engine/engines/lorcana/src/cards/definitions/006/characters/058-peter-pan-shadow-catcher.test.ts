/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { peterPanShadowCatcher } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan - Shadow Catcher", () => {
  it.skip("GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: peterPanShadowCatcher.cost,
      play: [peterPanShadowCatcher],
      hand: [peterPanShadowCatcher],
    });

    await testEngine.playCard(peterPanShadowCatcher);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
