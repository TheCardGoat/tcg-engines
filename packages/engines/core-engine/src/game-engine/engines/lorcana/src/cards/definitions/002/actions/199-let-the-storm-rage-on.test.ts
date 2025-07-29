import { describe, expect, it } from "bun:test";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  goofyKnightForADay,
  princeJohnGreediestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Let the Storm Rage On", () => {
  it("Deal 2 damage to chosen character. Draw a card.", () => {
    const testStore = new TestStore(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: 2,
      },
      { play: [goofyKnightForADay] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      letTheStormRageOn.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(2);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
  });
});

describe("Regression", () => {
  it("Can't target characters with ward", () => {
    const testStore = new TestStore(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: 2,
      },
      { play: [princeJohnGreediestOfAll] },
    );

    const cardUnderTest = testStore.getCard(letTheStormRageOn);
    const target = testStore.getCard(princeJohnGreediestOfAll);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] }, true);

    expect(target.meta.damage).toBeFalsy();
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
  });

  it("Should not draw before targeting", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: 2,
      },
      { play: [goofyKnightForADay] },
    );

    await testEngine.playCard(letTheStormRageOn);
    expect(testEngine.stackLayers).toHaveLength(2);
    expect(testEngine.getCardModel(goofyKnightForADay).damage).toBeFalsy();
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 0,
      }),
    );

    await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] }, true);
    expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
  });
});
