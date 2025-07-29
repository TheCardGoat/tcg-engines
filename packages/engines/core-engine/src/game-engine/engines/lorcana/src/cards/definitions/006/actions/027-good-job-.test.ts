/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goodJob } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

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
