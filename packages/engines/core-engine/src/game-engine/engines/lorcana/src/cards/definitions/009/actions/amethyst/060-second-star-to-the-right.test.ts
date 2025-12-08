import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { secondStarToTheRight } from "./060-second-star-to-the-right";

describe("Second Star To The Right", () => {
  it.skip("Sing Together 10 (Any number of your or your teammates’ characters with total cost 10 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: secondStarToTheRight.cost,
      play: [secondStarToTheRight],
      hand: [secondStarToTheRight],
    });

    await testEngine.playCard(secondStarToTheRight);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Chosen player draws 5 cards.", async () => {
    const testEngine = new TestEngine({
      inkwell: secondStarToTheRight.cost,
      play: [secondStarToTheRight],
      hand: [secondStarToTheRight],
    });

    await testEngine.playCard(secondStarToTheRight);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
