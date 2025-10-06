/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { longboat } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/items";

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
