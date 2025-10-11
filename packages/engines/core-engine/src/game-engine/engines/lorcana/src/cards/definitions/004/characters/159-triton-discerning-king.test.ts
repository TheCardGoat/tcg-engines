import { describe, expect, it } from "bun:test";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import { tritonDiscerningKing } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Triton - Discerning King", () => {
  it("**CONSIGN TO THE DEPTHS** {E}, Banish one of your items − Gain 3 lore.", () => {
    const testStore = new TestEngine({
      //inkwell: tritonDiscerningKing.cost,
      play: [tritonDiscerningKing, luckyDime],
    });

    const cardUnderTest = testStore.getCardModel(tritonDiscerningKing);

    const target = testStore.getCardModel(luckyDime);

    testStore.activateCard(cardUnderTest);
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    expect(testStore.getLoreForPlayer("player_one")).toEqual(3);
  });
});
