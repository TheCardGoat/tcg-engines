/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import {
  mickeyMouseInspirationalWarrior,
  teKaElementalTerror,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Inspirational Warrior", () => {
  it("STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.", async () => {
    const testStore = new TestStore(
      {
        inkwell: mickeyMouseInspirationalWarrior.cost,
        play: [mickeyMouseInspirationalWarrior],
        hand: [teKaElementalTerror],
      },
      {
        play: [mickeyMouseTrumpeter],
      },
    );
    const challengeTarget = testStore.getCard(mickeyMouseTrumpeter);
    challengeTarget.updateCardMeta({ exerted: true });
    const cardUnderTest = testStore.getCard(mickeyMouseInspirationalWarrior);
    cardUnderTest.challenge(challengeTarget);
    const cardToCheatOut = testStore.getCard(teKaElementalTerror);

    await testStore.resolveTopOfStack({ targets: [cardToCheatOut] });
    expect(cardToCheatOut.zone).toBe("play");
  });
});
