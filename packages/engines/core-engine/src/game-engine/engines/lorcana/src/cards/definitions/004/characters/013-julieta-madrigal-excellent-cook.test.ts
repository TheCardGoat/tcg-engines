import { describe, expect, it } from "bun:test";
import { chiefTui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { julietaMadrigalExcellentCook } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Julieta Madrigal - Excellent Cook", () => {
  it("**SIGNATURE RECIPE** When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: julietaMadrigalExcellentCook.cost,
      deck: 2,
      hand: [julietaMadrigalExcellentCook],
      play: [chiefTui],
    });

    const cardUnderTest = testEngine.getCardModel(julietaMadrigalExcellentCook);
    const target = testEngine.getCardModel(chiefTui);

    target.updateCardDamage(2, "add");

    cardUnderTest.playFromHand();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(0);
    expect(testEngine.getZonesCardCount().deck).toEqual(1);
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });

  it("No damage healed", async () => {
    const testEngine = new TestEngine({
      inkwell: julietaMadrigalExcellentCook.cost,
      deck: 2,
      hand: [julietaMadrigalExcellentCook],
      play: [chiefTui],
    });

    const cardUnderTest = testEngine.getCardModel(julietaMadrigalExcellentCook);
    const target = testEngine.getCardModel(chiefTui);

    cardUnderTest.playFromHand();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(0);
    expect(testEngine.getZonesCardCount().deck).toEqual(2);
    expect(testEngine.getZonesCardCount().hand).toEqual(0);
  });
});
