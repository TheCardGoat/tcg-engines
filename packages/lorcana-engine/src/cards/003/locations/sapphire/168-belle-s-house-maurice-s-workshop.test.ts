/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gastonArrogantHunter } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { bellesHouseMauricesWorkshop } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
