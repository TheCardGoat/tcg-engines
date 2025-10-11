import { describe, it } from "bun:test";
import { jujuMamaOdiesCompanion } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Juju - Mama Odie's Companion", () => {
  it.skip("BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: jujuMamaOdiesCompanion.cost,
      hand: [jujuMamaOdiesCompanion],
    });

    await testEngine.playCard(jujuMamaOdiesCompanion);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
