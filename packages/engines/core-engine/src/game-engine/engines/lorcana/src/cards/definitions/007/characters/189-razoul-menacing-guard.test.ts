/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { razoulMenacingGuard } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Razoul - Menacing Guard", () => {
  it.skip("MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.", async () => {
    const testEngine = new TestEngine({
      inkwell: razoulMenacingGuard.cost,
      hand: [razoulMenacingGuard],
    });

    await testEngine.playCard(razoulMenacingGuard);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
