/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jasmineRebelliousPrincess } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jasmine - Rebellious Princess", () => {
  it.skip("YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineRebelliousPrincess.cost,
      play: [jasmineRebelliousPrincess],
      hand: [jasmineRebelliousPrincess],
    });

    await testEngine.playCard(jasmineRebelliousPrincess);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
