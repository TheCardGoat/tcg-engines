import { describe, expect, it } from "bun:test";
import { generalLiHeadOfTheImperialArmy } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("General Li - Head of the Imperial Army", () => {
  it.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [generalLiHeadOfTheImperialArmy],
    });

    const cardUnderTest = testEngine.getCardModel(
      generalLiHeadOfTheImperialArmy,
    );
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
