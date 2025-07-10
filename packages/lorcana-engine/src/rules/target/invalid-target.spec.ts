/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  beastHardheaded,
  magicBroomBucketBrigade,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  cogsworthGrandfatherClock,
  judyHoppsOptimisticOfficer,
  theQueenCommandingPresence,
  theQueenRegalMonarch,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Invalid Target", () => {
  it("[Beast Hardheaded] On play effect, with NO item valid target", () => {
    const testStore = new TestStore(
      {
        inkwell: beastHardheaded.cost,
        hand: [beastHardheaded],
      },
      {
        hand: [magicBroomBucketBrigade],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", beastHardheaded.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    expect(cardUnderTest.zone).toEqual("play");
  });

  it("[Judy Hopps] On play effect, with NO item valid target", () => {
    const testStore = new TestStore({
      inkwell: judyHoppsOptimisticOfficer.cost,
      hand: [judyHoppsOptimisticOfficer],
      deck: 2,
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      judyHoppsOptimisticOfficer.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 2,
        play: 1,
      }),
    );
  });

  it("When opponent only has targets with ward, effect should be cancelled", async () => {
    const testEngine = new TestEngine(
      {
        play: [theQueenCommandingPresence, theQueenRegalMonarch],
      },
      { play: [cogsworthGrandfatherClock] },
    );

    const cardUnderTest = testEngine.getCardModel(theQueenCommandingPresence);
    const target = testEngine.getCardModel(theQueenRegalMonarch);

    await testEngine.questCard(cardUnderTest);
    expect(testEngine.stackLayers).toHaveLength(1);

    await testEngine.resolveTopOfStack({ targets: [target] }, true);
    expect(target.strength).toEqual(theQueenRegalMonarch.strength + 4);

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  // it("[Painting the Roses Red] 'up to' target should not be required", () => {
  //   const testStore = new TestStore({
  //     inkwell: paintingTheRosesRed.cost,
  //     hand: [paintingTheRosesRed],
  //     deck: 1,
  //   });
  //
  //   const cardUnderTest = testStore.getByZoneAndId(
  //     "hand",
  //     paintingTheRosesRed.id,
  //   );
  //
  //   cardUnderTest.playFromHand();
  //   testStore.resolveTopOfStack({ targets: [] });
  //
  //   expect(testStore.getZonesCardCount()).toEqual(
  //     expect.objectContaining({
  //       hand: 1,
  //       deck: 0,
  //     }),
  //   );
  // });
});
