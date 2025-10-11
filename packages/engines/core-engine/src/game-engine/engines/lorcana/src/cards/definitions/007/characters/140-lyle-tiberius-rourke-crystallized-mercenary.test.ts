import { describe, expect, it } from "bun:test";
import {
  kakamoraBandOfPirates,
  kenaiProtectiveBrother,
  lyleTiberiusRourkeCrystallizedMercenary,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
