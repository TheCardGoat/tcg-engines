import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { motunuiIslandParadise } from "./170-motunui-island-paradise";

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
