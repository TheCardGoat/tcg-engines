/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { donaldDuckSleepwalker } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Donald Duck - Sleepwalker", () => {
  it.skip("**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: donaldDuckSleepwalker.cost,
      play: [donaldDuckSleepwalker],
      hand: [donaldDuckSleepwalker],
    });

    await testEngine.playCard(donaldDuckSleepwalker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
