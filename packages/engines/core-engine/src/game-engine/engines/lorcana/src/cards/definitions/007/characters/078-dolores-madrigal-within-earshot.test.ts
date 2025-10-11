import { describe, it } from "bun:test";
import { doloresMadrigalWithinEarshot } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dolores Madrigal - Within Earshot", () => {
  it.skip("I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: doloresMadrigalWithinEarshot.cost,
      play: [doloresMadrigalWithinEarshot],
      hand: [doloresMadrigalWithinEarshot],
    });

    await testEngine.playCard(doloresMadrigalWithinEarshot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
