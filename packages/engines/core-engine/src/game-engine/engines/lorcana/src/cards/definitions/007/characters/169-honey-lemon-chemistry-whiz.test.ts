/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { honeyLemonChemistryWhiz } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Honey Lemon - Chemistry Whiz", () => {
  it.skip("PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: honeyLemonChemistryWhiz.cost,
      play: [honeyLemonChemistryWhiz],
      hand: [honeyLemonChemistryWhiz],
    });

    await testEngine.playCard(honeyLemonChemistryWhiz);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
