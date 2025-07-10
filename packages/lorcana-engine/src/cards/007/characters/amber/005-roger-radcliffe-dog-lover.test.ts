/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rogerRadcliffeDogLover } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
