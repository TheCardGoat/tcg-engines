import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { lostInTheWoods } from "./028-lost-in-the-woods";

describe("Lost in the Woods", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: lostInTheWoods.cost,
      play: [lostInTheWoods],
      hand: [lostInTheWoods],
    });

    await testEngine.playCard(lostInTheWoods);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("All opposing characters get -2 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: lostInTheWoods.cost,
      play: [lostInTheWoods],
      hand: [lostInTheWoods],
    });

    await testEngine.playCard(lostInTheWoods);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
