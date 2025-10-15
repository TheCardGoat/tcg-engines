import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { cinderellaGentleAndKind } from "./019-cinderella-gentle-and-kind";

describe("Cinderella - Gentle and Kind", () => {
  it.skip("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", async () => {
    const testEngine = new TestEngine({
      play: [cinderellaGentleAndKind],
    });

    const cardUnderTest = testEngine.getCardModel(cinderellaGentleAndKind);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });

  it.skip("**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.", async () => {
    const testEngine = new TestEngine({
      inkwell: cinderellaGentleAndKind.cost,
      play: [cinderellaGentleAndKind],
      hand: [cinderellaGentleAndKind],
    });

    await testEngine.playCard(cinderellaGentleAndKind);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
