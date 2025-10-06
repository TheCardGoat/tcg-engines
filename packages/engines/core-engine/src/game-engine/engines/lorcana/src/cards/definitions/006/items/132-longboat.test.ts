/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { longboat } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Longboat", () => {
  it.skip("TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: longboat.cost,
      play: [longboat],
      hand: [longboat],
    });

    await testEngine.playCard(longboat);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
