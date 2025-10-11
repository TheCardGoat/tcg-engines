import { describe, it } from "bun:test";
import { motunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Motunui - Island Paradise", () => {
  it.skip("**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: motunuiIslandParadise.cost,
      play: [motunuiIslandParadise],
      hand: [motunuiIslandParadise],
    });

    await testEngine.playCard(motunuiIslandParadise);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
