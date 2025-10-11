import { describe, expect, it } from "bun:test";
import { rafikiEtherealGuide } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rafiki - Ethereal Guide", () => {
  it("Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)", async () => {
    const testEngine = new TestEngine({
      play: [rafikiEtherealGuide],
    });

    const cardUnderTest = testEngine.getCardModel(rafikiEtherealGuide);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: rafikiEtherealGuide.cost,
      play: [rafikiEtherealGuide],
      hand: [rafikiEtherealGuide],
    });

    await testEngine.playCard(rafikiEtherealGuide);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
