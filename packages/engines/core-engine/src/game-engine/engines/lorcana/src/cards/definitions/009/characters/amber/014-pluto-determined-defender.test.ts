import { describe, expect, it } from "bun:test";
import { plutoDeterminedDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pluto - Determined Defender", () => {
  it.skip("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Pluto.)_", async () => {
    const testEngine = new TestEngine({
      play: [plutoDeterminedDefender],
    });

    const cardUnderTest = testEngine.getCardModel(plutoDeterminedDefender);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
    const testEngine = new TestEngine({
      play: [plutoDeterminedDefender],
    });

    const cardUnderTest = testEngine.getCardModel(plutoDeterminedDefender);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it.skip("**GUARD DOG** At the start of your turn, remove up to 3 damage from this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoDeterminedDefender.cost,
      play: [plutoDeterminedDefender],
      hand: [plutoDeterminedDefender],
    });

    await testEngine.playCard(plutoDeterminedDefender);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
