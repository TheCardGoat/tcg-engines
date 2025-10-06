/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { healWhatHasBeenHurt } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heal What Has Been Hurt", () => {
  it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: healWhatHasBeenHurt.cost,
      play: [healWhatHasBeenHurt],
      hand: [healWhatHasBeenHurt],
    });

    await testEngine.playCard(healWhatHasBeenHurt);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Remove up to 3 damage from chosen character. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: healWhatHasBeenHurt.cost,
      play: [healWhatHasBeenHurt],
      hand: [healWhatHasBeenHurt],
    });

    await testEngine.playCard(healWhatHasBeenHurt);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
