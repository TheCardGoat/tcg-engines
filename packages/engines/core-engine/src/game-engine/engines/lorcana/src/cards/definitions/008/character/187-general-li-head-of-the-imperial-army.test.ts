/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { generalLiHeadOfTheImperialArmy } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

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
