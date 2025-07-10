/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { partOfOurWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { iWontGiveIn } from "@lorcanito/lorcana-engine/cards/006";
import {
  calhounBattletested,
  calhounCourageousRescuer,
  candleheadDedicatedRacer,
  fixitFelixJrPintsizedHero,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Fix‐It Felix, Jr. - Pint‐Sized Hero", () => {
  it("LET’S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can’t quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: iWontGiveIn.cost,
      discard: [candleheadDedicatedRacer],
      play: [fixitFelixJrPintsizedHero, calhounBattletested],
      hand: [iWontGiveIn],
    });

    const cardFromDiscar = testEngine.getCardModel(candleheadDedicatedRacer);
    const actionInHand = testEngine.getCardModel(iWontGiveIn);
    const cardInPlay = testEngine.getCardModel(calhounBattletested);

    await testEngine.exertCard(cardInPlay);

    expect(cardInPlay.exerted).toBe(true);

    await testEngine.playCard(actionInHand);
    await testEngine.resolveTopOfStack({ targets: [cardFromDiscar] }, true);
    expect(cardFromDiscar.zone).toBe("hand");

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [cardInPlay] });

    expect(cardInPlay.exerted).toBe(false);

    expect(cardInPlay.hasQuestRestriction).toBe(true);
  });

  it("LET’S GET TO WORK GET TO WORK Try selecting a pilot to make ready from deck, I expect an exception", async () => {
    const testEngine = new TestEngine({
      inkwell: iWontGiveIn.cost,
      discard: [candleheadDedicatedRacer],
      play: [fixitFelixJrPintsizedHero],
      hand: [iWontGiveIn],
      deck: [calhounBattletested],
    });

    const cardFromDiscar = testEngine.getCardModel(candleheadDedicatedRacer);
    const actionInHand = testEngine.getCardModel(iWontGiveIn);
    const cardInDeck = testEngine.getCardModel(calhounBattletested);

    await testEngine.exertCard(cardInDeck);

    expect(cardInDeck.exerted).toBe(true);

    await testEngine.playCard(actionInHand);
    await testEngine.resolveTopOfStack({ targets: [cardFromDiscar] }, true);

    expect(cardFromDiscar.zone).toBe("hand");
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
