import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { developYourBrain } from "./163-develop-your-brain";

describe("Develop Your Brain", () => {
  it.skip("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: developYourBrain.cost,
      play: [developYourBrain],
      hand: [developYourBrain],
    });

    await testEngine.playCard(developYourBrain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
