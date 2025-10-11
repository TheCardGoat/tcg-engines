import { describe, expect, it } from "bun:test";
import {
  letTheStormRageOn,
  strengthOfARagingFire,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { shereKhanInfamousTiger } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("IT IS REGRETTABLE When you play this character, discard your hand.", () => {
  it.skip("", async () => {
    const testEngine = new TestEngine({
      inkwell: shereKhanInfamousTiger.cost,
      hand: [shereKhanInfamousTiger, letTheStormRageOn, strengthOfARagingFire],
    });

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 3, discard: 0 }),
    );

    const cardDiscarded1 = testEngine.getCardModel(letTheStormRageOn);
    const cardDiscarded2 = testEngine.getCardModel(strengthOfARagingFire);

    await testEngine.playCard(shereKhanInfamousTiger);

    expect(testEngine.getCardModel(letTheStormRageOn).zone).toEqual("discard");
    expect(testEngine.getCardModel(strengthOfARagingFire).zone).toEqual(
      "discard",
    );

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 0, discard: 3 }),
    );
  });
});
