/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { sapphireChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

describe("Sapphire Chromicon", () => {
  it.skip("**POWERING UP** This item enters play exerted.", () => {
    const testEngine = new TestEngine({
      inkwell: sapphireChromicon.cost,
      play: [sapphireChromicon],
    });

    const cardUnderTest = testEngine.getCardModel(sapphireChromicon);

    cardUnderTest.playFromHand();
    testEngine.resolveOptionalAbility();
    testEngine.resolveTopOfStack({});
  });

  it("**SAPPHIRE LIGHT** {E}, 2 {I}, Banish one of your items – Gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: sapphireChromicon.cost + pawpsicle.cost,
      play: [sapphireChromicon, pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(sapphireChromicon);
    const target = testEngine.getCardModel(pawpsicle);
    expect(testEngine.getPlayerLore()).toBe(0);

    cardUnderTest.activate();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
    expect(testEngine.getCardZone(target)).toBe("discard");
    expect(testEngine.getPlayerLore()).toBe(2);
  });
});
