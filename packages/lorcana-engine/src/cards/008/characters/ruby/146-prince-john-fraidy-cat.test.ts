/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { princeJohnFraidycat } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Prince John - Fraidy-Cat", () => {
  it("HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mickeyMouseTrueFriend.cost + mickeyMouseFoodFightDefender.cost,
        hand: [mickeyMouseTrueFriend, mickeyMouseFoodFightDefender],
      },
      {
        play: [princeJohnFraidycat],
      },
    );

    const cardUnderTest = testEngine.getCardModel(princeJohnFraidycat);
    expect(cardUnderTest.damage).toEqual(0);

    await testEngine.playCard(mickeyMouseTrueFriend);
    expect(cardUnderTest.damage).toEqual(1);

    await testEngine.playCard(mickeyMouseFoodFightDefender);
    expect(cardUnderTest.damage).toEqual(2);
  });
});
