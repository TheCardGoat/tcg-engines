import { describe, expect, it } from "bun:test";
import { peterPansShadowNotSewnOn } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan's Shadow - Not Sewn On", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
    const testEngine = new TestEngine({
      play: [peterPansShadowNotSewnOn],
    });

    const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("**Rush** _(This character can challenge the turn they're played.)_", async () => {
    const testEngine = new TestEngine({
      play: [peterPansShadowNotSewnOn],
    });

    const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it.skip("**TIPTOE** Your other characters with **Rush** gain **Evasive**.", async () => {
    const testEngine = new TestEngine({
      inkwell: peterPansShadowNotSewnOn.cost,
      play: [peterPansShadowNotSewnOn],
      hand: [peterPansShadowNotSewnOn],
    });

    await testEngine.playCard(peterPansShadowNotSewnOn);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
