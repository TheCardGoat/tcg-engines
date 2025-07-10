/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { whenWillMyLifeBegin } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("When Will My Life Begin?", () => {
  it("Chosen character can’t challenge during their next turn. Draw a card.", () => {
    const testStore = new TestStore(
      {
        inkwell: whenWillMyLifeBegin.cost,
        hand: [whenWillMyLifeBegin],
        play: [pinocchioOnTheRun],
        deck: 1,
      },
      {
        play: [liloMakingAWish],
      },
    );

    const cardUnderTest = testStore.getCard(whenWillMyLifeBegin);
    const target = testStore.getCard(liloMakingAWish);
    const defender = testStore.getCard(pinocchioOnTheRun);
    defender.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(testStore.getZonesCardCount().hand).toEqual(1);

    testStore.passTurn();

    expect(target.canChallenge(defender)).toEqual(false);
  });
});
