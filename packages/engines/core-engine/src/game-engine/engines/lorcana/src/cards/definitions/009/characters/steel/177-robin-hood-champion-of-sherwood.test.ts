import { describe, expect, it } from "bun:test";
import { robinHoodChampionOfSherwood } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Robin Hood - Champion of Sherwood", () => {
  it.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)_", async () => {
    const testEngine = new TestEngine({
      play: [robinHoodChampionOfSherwood],
    });

    const cardUnderTest = testEngine.getCardModel(robinHoodChampionOfSherwood);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("**SKILLED COMBATANT** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: robinHoodChampionOfSherwood.cost,
      play: [robinHoodChampionOfSherwood],
      hand: [robinHoodChampionOfSherwood],
    });

    await testEngine.playCard(robinHoodChampionOfSherwood);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("**THE GOOD OF OTHERS** When this character is banished in a challenge, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: robinHoodChampionOfSherwood.cost,
      play: [robinHoodChampionOfSherwood],
      hand: [robinHoodChampionOfSherwood],
    });

    await testEngine.playCard(robinHoodChampionOfSherwood);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
