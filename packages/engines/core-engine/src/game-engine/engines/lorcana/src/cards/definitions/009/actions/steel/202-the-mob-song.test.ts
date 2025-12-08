import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { theMobSong } from "./202-the-mob-song";

describe("The Mob Song", () => {
  it.skip("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: theMobSong.cost,
      play: [theMobSong],
      hand: [theMobSong],
    });

    await testEngine.playCard(theMobSong);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Deal 3 damage to up to 3 chosen characters and/or locations.", async () => {
    const testEngine = new TestEngine({
      inkwell: theMobSong.cost,
      play: [theMobSong],
      hand: [theMobSong],
    });

    await testEngine.playCard(theMobSong);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
