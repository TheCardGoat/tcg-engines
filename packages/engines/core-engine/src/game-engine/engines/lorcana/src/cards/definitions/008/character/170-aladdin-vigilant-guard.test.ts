import { describe, expect, it } from "bun:test";
import {
  aladdinVigilantGuard,
  jimDearBelovedHusband,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Aladdin - Vigilant Guard", () => {
  it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [aladdinVigilantGuard],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinVigilantGuard);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it("SAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: aladdinVigilantGuard.cost + jimDearBelovedHusband.cost,
      play: [aladdinVigilantGuard, jimDearBelovedHusband],
    });

    const aladdin = testEngine.getCardModel(aladdinVigilantGuard);
    const jim = testEngine.getCardModel(jimDearBelovedHusband);

    aladdin.meta.damage = 2;
    expect(aladdin.meta.damage).toBe(2);

    jim.quest();

    await testEngine.resolveOptionalAbility();
    expect(aladdin.meta.damage).toBe(0);
  });
});
