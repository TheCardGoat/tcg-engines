/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { jafarDreadnought } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
