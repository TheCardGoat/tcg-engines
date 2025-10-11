import { describe, expect, it } from "bun:test";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { ursulaDeceiverOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Deceiver of All", () => {
  it("**WHAT A DEAL** Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: friendsOnTheOtherSide.cost,
      play: [ursulaDeceiverOfAll],
      hand: [friendsOnTheOtherSide],
      deck: 6,
    });

    const cardUnderTest = testStore.getCard(ursulaDeceiverOfAll);
    const target = testStore.getCard(friendsOnTheOtherSide);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 6,
      }),
    );

    cardUnderTest.sing(target);
    testStore.resolveOptionalAbility();

    expect(target.zone).toBe("deck");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 4,
        deck: 3,
      }),
    );
  });
});
