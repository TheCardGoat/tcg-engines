/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goodJob } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Good Job!", () => {
  it.skip("Chosen character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: goodJob.cost,
      play: [goodJob],
      hand: [goodJob],
    });

    await testEngine.playCard(goodJob);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
