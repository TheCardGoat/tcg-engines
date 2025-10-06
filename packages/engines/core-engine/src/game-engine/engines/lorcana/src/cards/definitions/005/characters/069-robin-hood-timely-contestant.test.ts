/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { robinHoodTimelyContestant } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Robin Hood - Timely Contestant", () => {
  it("**TAG ME IN!** For each 1 damage on opposing characters, you pay 1 {I} less to play this character.", () => {
    const testStore = new TestStore(
      {
        play: [robinHoodTimelyContestant],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getCard(robinHoodTimelyContestant);
    const targetCard = testStore.getCard(goofyKnightForADay);

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((damage) => {
      targetCard.updateCardMeta({ damage });
      expect(cardUnderTest.cost).toBe(robinHoodTimelyContestant.cost - damage);
    });
  });
});
