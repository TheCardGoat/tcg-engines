/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { jafarDreadnought } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jafar- Dreadnought", () => {
  it("**NOW WHERE WERE WE?** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    const testStore = new TestStore(
      {
        play: [jafarDreadnought],
        deck: 2,
      },
      {
        play: [liloMakingAWish],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", jafarDreadnought.id);
    const target = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );
    target.updateCardMeta({ exerted: true });

    cardUnderTest.challenge(target);
    testStore.resolveOptionalAbility();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
