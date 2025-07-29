import { describe, expect, it } from "bun:test";
import { seekingTheHalfCrown } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Seeking The Half Crown", () => {
  it.skip("For each Sorcerer character you have in play, you pay 1 {I} less to play this action.", async () => {
    const testEngine = new TestEngine({
      inkwell: seekingTheHalfCrown.cost,
      play: [seekingTheHalfCrown],
      hand: [seekingTheHalfCrown],
    });

    await testEngine.playCard(seekingTheHalfCrown);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Draw 2 cards.", async () => {
    const testEngine = new TestEngine({
      inkwell: seekingTheHalfCrown.cost,
      play: [seekingTheHalfCrown],
      hand: [seekingTheHalfCrown],
    });

    await testEngine.playCard(seekingTheHalfCrown);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
