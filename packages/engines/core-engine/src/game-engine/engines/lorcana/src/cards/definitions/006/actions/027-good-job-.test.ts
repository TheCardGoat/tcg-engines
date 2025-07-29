import { describe, expect, it } from "bun:test";
import { goodJob } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
