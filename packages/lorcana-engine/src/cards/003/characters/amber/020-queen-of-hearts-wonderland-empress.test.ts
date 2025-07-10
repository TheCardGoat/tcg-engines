/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hadesLordOfUnderworld,
  rapunzelGiftedWithHealing,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { queenOfHeartsWonderlandEmpress } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
