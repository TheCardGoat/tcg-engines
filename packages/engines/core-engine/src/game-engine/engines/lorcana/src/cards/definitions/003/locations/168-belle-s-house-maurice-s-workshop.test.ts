/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gastonArrogantHunter } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { bellesHouseMauricesWorkshop } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle's House - Maurice's Workshop", () => {
  it("**LABORATORY** If you have a character here, you pay 1 {I} less to play items.", async () => {
    const testEngine = new TestEngine({
      inkwell: bellesHouseMauricesWorkshop.moveCost,
      play: [bellesHouseMauricesWorkshop, gastonArrogantHunter],
      hand: [pawpsicle],
    });

    const character = testEngine.getCardModel(gastonArrogantHunter);
    const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
    const item = testEngine.getCardModel(pawpsicle);
    await testEngine.moveToLocation({ location, character });

    expect(item.cost).toBe(pawpsicle.cost - 1);
  });
});
