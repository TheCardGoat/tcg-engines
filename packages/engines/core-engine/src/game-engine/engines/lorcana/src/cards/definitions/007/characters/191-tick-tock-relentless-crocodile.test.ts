import { describe, it } from "bun:test";
import { ticktockRelentlessCrocodile } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tick-tock - Relentless Crocodile", () => {
  it.skip("LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      inkwell: ticktockRelentlessCrocodile.cost,
      play: [ticktockRelentlessCrocodile],
      hand: [ticktockRelentlessCrocodile],
    });

    await testEngine.playCard(ticktockRelentlessCrocodile);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
