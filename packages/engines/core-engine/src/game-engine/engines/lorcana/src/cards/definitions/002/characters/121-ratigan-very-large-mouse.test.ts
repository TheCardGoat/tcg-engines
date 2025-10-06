/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  eliLaBouffBigDaddy,
  goofyKnightForADay,
  ratiganVeryLargeMouse,
  rayEasygoingFirefly,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ratigan - Very Large Mouse", () => {
  it("**THIS IS MY KINGDOM** When you play this character, exert chosen opposing character with 3 {S} or less. Chose one of your characters and ready them. They can't quest for the rest of this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: ratiganVeryLargeMouse.cost,
        hand: [ratiganVeryLargeMouse],
        play: [goofyKnightForADay],
      },
      { play: [rayEasygoingFirefly] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      ratiganVeryLargeMouse.id,
    );
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
    const targetOpp = testStore.getByZoneAndId(
      "play",
      rayEasygoingFirefly.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ targets: [targetOpp] }, true);
    expect(targetOpp.ready).toEqual(false);

    testStore.resolveTopOfStack({ targets: [target] }, true);
    expect(target.ready).toEqual(true);
    expect(target.hasQuestRestriction).toEqual(true);
  });
});

describe("Regression", () => {
  it("should NOT block the game if there is not valid cards, on the opponent side", async () => {
    const testEngine = new TestEngine({
      inkwell: ratiganVeryLargeMouse.cost,
      hand: [ratiganVeryLargeMouse],
    });

    await testEngine.playCard(ratiganVeryLargeMouse);

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("should NOT block the game if there is not valid cards on your side", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: ratiganVeryLargeMouse.cost,
        hand: [ratiganVeryLargeMouse],
      },
      {
        play: [eliLaBouffBigDaddy],
      },
    );

    await testEngine.playCard(
      ratiganVeryLargeMouse,
      {
        targets: [eliLaBouffBigDaddy],
      },
      true,
    );

    expect(testEngine.getCardModel(eliLaBouffBigDaddy).exerted).toEqual(true);
    // expect(testEngine.stackLayers).toHaveLength(2);

    // await testEngine.acceptOptionalLayer();
    // expect(testEngine.stackLayers).toHaveLength(1);
    // await testEngine.acceptOptionalLayer();
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
