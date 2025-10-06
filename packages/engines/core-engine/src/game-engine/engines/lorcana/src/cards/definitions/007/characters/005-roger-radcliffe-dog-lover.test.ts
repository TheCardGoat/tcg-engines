/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rogerRadcliffeDogLover } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Roger Radcliffe - Dog Lover", () => {
  it.skip("THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.", async () => {
    const testEngine = new TestEngine({
      inkwell: rogerRadcliffeDogLover.cost,
      play: [rogerRadcliffeDogLover],
      hand: [rogerRadcliffeDogLover],
    });

    await testEngine.playCard(rogerRadcliffeDogLover);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
