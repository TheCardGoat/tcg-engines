import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { underTheSea } from "./097-under-the-sea";

describe("Under The Sea", () => {
  it.skip("Sing Together 8 (Any number of your or your teammates’ characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: underTheSea.cost,
      play: [underTheSea],
      hand: [underTheSea],
    });

    await testEngine.playCard(underTheSea);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: underTheSea.cost,
      play: [underTheSea],
      hand: [underTheSea],
    });

    await testEngine.playCard(underTheSea);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
