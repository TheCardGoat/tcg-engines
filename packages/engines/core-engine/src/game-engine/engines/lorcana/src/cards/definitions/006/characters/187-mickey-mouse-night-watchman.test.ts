/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mickeyMouseNightWatchman } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Mickey Mouse - Night Watchman", () => {
  it.skip("SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseNightWatchman.cost,
      play: [mickeyMouseNightWatchman],
      hand: [mickeyMouseNightWatchman],
    });

    await testEngine.playCard(mickeyMouseNightWatchman);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
