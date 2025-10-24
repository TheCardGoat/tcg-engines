import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { moanaOfMotunui } from "./020-moana-of-motunui";

describe("Moana - Of Motunui", () => {
  it.skip("**WE CAN FIX IT** Whenever this character quests, you may ready your other Princess characters. They can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: moanaOfMotunui.cost,
      play: [moanaOfMotunui],
      hand: [moanaOfMotunui],
    });

    await testEngine.playCard(moanaOfMotunui);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
