import { describe, it } from "bun:test";
import { plutoRescueDog } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pluto - Rescue Dog", () => {
  it.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoRescueDog.cost,
      hand: [plutoRescueDog],
    });

    await testEngine.playCard(plutoRescueDog);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
