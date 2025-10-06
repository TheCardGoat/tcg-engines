/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mickeyMouseTrumpeter } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Trumpeter", () => {
  it.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseTrumpeter.cost,
      play: [mickeyMouseTrumpeter],
      hand: [mickeyMouseTrumpeter],
    });

    await testEngine.playCard(mickeyMouseTrumpeter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
