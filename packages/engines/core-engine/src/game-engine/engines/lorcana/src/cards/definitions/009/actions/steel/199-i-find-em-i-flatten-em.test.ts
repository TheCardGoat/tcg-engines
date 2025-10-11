import { describe, it } from "bun:test";
import { iFindEmIFlattenEm } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("I Find 'Em, I Flatten 'Em", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: iFindEmIFlattenEm.cost,
      play: [iFindEmIFlattenEm],
      hand: [iFindEmIFlattenEm],
    });

    await testEngine.playCard(iFindEmIFlattenEm);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Banish all items.", async () => {
    const testEngine = new TestEngine({
      inkwell: iFindEmIFlattenEm.cost,
      play: [iFindEmIFlattenEm],
      hand: [iFindEmIFlattenEm],
    });

    await testEngine.playCard(iFindEmIFlattenEm);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
