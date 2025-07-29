import { describe, expect, it } from "bun:test";
import { trialsAndTribulations } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Trials And Tribulations", () => {
  it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: trialsAndTribulations.cost,
      play: [trialsAndTribulations],
      hand: [trialsAndTribulations],
    });

    await testEngine.playCard(trialsAndTribulations);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Chosen character gets -4 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: trialsAndTribulations.cost,
      play: [trialsAndTribulations],
      hand: [trialsAndTribulations],
    });

    await testEngine.playCard(trialsAndTribulations);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
