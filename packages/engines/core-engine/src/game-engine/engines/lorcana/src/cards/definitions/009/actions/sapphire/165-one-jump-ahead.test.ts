import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { oneJumpAhead } from "./165-one-jump-ahead";

describe("One Jump Ahead", () => {
  it.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: oneJumpAhead.cost,
      play: [oneJumpAhead],
      hand: [oneJumpAhead],
    });

    await testEngine.playCard(oneJumpAhead);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: oneJumpAhead.cost,
      play: [oneJumpAhead],
      hand: [oneJumpAhead],
    });

    await testEngine.playCard(oneJumpAhead);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
