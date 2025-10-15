import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { aurelianGyrosensor } from "./167-aurelian-gyrosensor";

describe("Aurelian Gyrosensor", () => {
  it.skip("**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: aurelianGyrosensor.cost,
      play: [aurelianGyrosensor],
      hand: [aurelianGyrosensor],
    });

    await testEngine.playCard(aurelianGyrosensor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
