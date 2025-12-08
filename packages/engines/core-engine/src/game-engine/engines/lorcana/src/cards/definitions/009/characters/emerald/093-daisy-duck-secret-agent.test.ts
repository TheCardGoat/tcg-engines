import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { daisyDuckSecretAgent } from "./093-daisy-duck-secret-agent";

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
