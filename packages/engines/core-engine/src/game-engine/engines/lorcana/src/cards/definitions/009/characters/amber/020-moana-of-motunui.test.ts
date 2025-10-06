/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
