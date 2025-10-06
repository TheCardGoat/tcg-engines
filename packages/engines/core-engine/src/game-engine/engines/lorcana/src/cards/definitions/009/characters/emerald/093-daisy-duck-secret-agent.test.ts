/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { daisyDuckSecretAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Daisy Duck - Secret Agent", () => {
  it.skip("**THWART** Whenever this character quests, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: daisyDuckSecretAgent.cost,
      play: [daisyDuckSecretAgent],
      hand: [daisyDuckSecretAgent],
    });

    await testEngine.playCard(daisyDuckSecretAgent);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
