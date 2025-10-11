import { describe, it } from "bun:test";
import { poohPirateShip } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pooh Pirate Ship", () => {
  it.skip("MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: poohPirateShip.cost,
      play: [poohPirateShip],
      hand: [poohPirateShip],
    });

    await testEngine.playCard(poohPirateShip);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
