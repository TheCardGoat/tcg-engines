import { describe, expect, it } from "bun:test";
import { wakeUpAlice } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wake Up, Alice!", () => {
  it.skip("Return chosen damaged character to their player's hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: wakeUpAlice.cost,
      play: [wakeUpAlice],
      hand: [wakeUpAlice],
    });

    await testEngine.playCard(wakeUpAlice);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
