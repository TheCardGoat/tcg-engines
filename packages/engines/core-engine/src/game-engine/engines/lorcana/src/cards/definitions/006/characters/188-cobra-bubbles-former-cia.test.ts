import { describe, expect, it } from "bun:test";
import { cobraBubblesFormerCia } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cobra Bubbles - Former CIA", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [cobraBubblesFormerCia],
    });

    const cardUnderTest = testEngine.getCardModel(cobraBubblesFormerCia);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it.skip("THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: cobraBubblesFormerCia.cost,
      play: [cobraBubblesFormerCia],
      hand: [cobraBubblesFormerCia],
    });

    await testEngine.playCard(cobraBubblesFormerCia);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
