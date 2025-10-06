/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mrSmeeEfficientCaptain } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Mr. Smee - Efficient Captain", () => {
  it.skip("PIPE UP THE CREW Whenever you play an action that isn’t a song, you may ready chosen Pirate character.", async () => {
    const testEngine = new TestEngine({
      inkwell: mrSmeeEfficientCaptain.cost,
      play: [mrSmeeEfficientCaptain],
      hand: [mrSmeeEfficientCaptain],
    });

    await testEngine.playCard(mrSmeeEfficientCaptain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
