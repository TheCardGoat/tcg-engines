import { describe, it } from "bun:test";
import { worldsGreatestCriminalMind } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("World's Greatest Criminal Mind", () => {
  it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: worldsGreatestCriminalMind.cost,
      play: [worldsGreatestCriminalMind],
      hand: [worldsGreatestCriminalMind],
    });

    await testEngine.playCard(worldsGreatestCriminalMind);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Banish chosen character with 5 {S} or more.", async () => {
    const testEngine = new TestEngine({
      inkwell: worldsGreatestCriminalMind.cost,
      play: [worldsGreatestCriminalMind],
      hand: [worldsGreatestCriminalMind],
    });

    await testEngine.playCard(worldsGreatestCriminalMind);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
