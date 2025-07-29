import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { pinocchioOnTheRun } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { whenWillMyLifeBegin } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
