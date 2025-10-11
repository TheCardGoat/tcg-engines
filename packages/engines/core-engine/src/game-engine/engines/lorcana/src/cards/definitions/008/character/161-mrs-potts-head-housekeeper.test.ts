import { describe, expect, it } from "bun:test";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { lumiereFieryFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { mrsPottsHeadHousekeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
