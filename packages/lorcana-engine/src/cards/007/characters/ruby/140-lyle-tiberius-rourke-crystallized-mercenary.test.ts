/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kakamoraBandOfPirates,
  kenaiProtectiveBrother,
  lyleTiberiusRourkeCrystallizedMercenary,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Lyle Tiberius Rourke - Crystallized Mercenary", () => {
  it("EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.", async () => {
    const testEngine = new TestEngine(
      {
        play: [lyleTiberiusRourkeCrystallizedMercenary],
        hand: [kenaiProtectiveBrother],
      },
      {
        play: [kakamoraBandOfPirates],
      },
    );

    await testEngine.putIntoInkwell(kenaiProtectiveBrother);

    expect(testEngine.getCardModel(kakamoraBandOfPirates).damage).toEqual(2);
    expect(
      testEngine.getCardModel(lyleTiberiusRourkeCrystallizedMercenary).damage,
    ).toEqual(2);
  });
});
