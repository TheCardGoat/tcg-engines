import { describe, it } from "bun:test";
import { wreckitRalphHamHands } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wreck-it Ralph - Ham Hands", () => {
  it.skip("I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphHamHands.cost,
      play: [wreckitRalphHamHands],
      hand: [wreckitRalphHamHands],
    });

    await testEngine.playCard(wreckitRalphHamHands);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
