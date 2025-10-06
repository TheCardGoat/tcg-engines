/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { lumiereFieryFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { mrsPottsHeadHousekeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Mrs. Potts - Head Housekeeper", () => {
  it("CLEAN UP {E}, Banish one of your items – Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: mrsPottsHeadHousekeeper.cost,
      play: [mrsPottsHeadHousekeeper, pawpsicle],
      deck: [lumiereFieryFriend],
    });

    await testEngine.activateCard(mrsPottsHeadHousekeeper);
    await testEngine.resolveTopOfStack({
      targets: [pawpsicle],
    });
    expect(testEngine.getCardModel(pawpsicle).zone).toBe("discard");
    expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("hand");
  });
});
