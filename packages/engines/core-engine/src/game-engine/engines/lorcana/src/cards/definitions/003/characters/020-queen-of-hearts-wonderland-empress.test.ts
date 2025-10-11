import { describe, expect, it } from "bun:test";
import {
  hadesLordOfUnderworld,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { queenOfHeartsWonderlandEmpress } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen of Hearts - Wonderland Empress", () => {
  it("**All Ways Here Are My Ways** Whenever this character quests, your other Villain characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      play: [
        queenOfHeartsWonderlandEmpress,
        hadesLordOfUnderworld,
        rapunzelGiftedWithHealing,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(
      queenOfHeartsWonderlandEmpress,
    );
    const villain = testEngine.getCardModel(hadesLordOfUnderworld);
    const nonVillain = testEngine.getCardModel(rapunzelGiftedWithHealing);

    cardUnderTest.quest();

    expect(cardUnderTest.lore).toBe(1); // not effecting herself
    expect(villain.lore).toBe(2); // effecting villain
    expect(nonVillain.lore).toBe(2); // not effecting non-villain

    await testEngine.passTurn();

    expect(villain.lore).toBe(1);
    expect(nonVillain.lore).toBe(2);
  });
});
