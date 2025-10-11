import { describe, expect, it } from "bun:test";
import { mickeyMouseTrumpeter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import {
  mickeyMouseInspirationalWarrior,
  teKaElementalTerror,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
