/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { mickeyMouseFoodFightDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { princeJohnFraidycat } from "~/game-engine/engines/lorcana/src/cards/definitions/008";

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
