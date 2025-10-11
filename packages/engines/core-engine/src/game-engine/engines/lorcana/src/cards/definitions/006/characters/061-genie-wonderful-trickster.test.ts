import { describe, expect, it } from "bun:test";
import { genieWonderfulTrickster } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Genie - Wonderful Trickster", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)", async () => {
    const testEngine = new TestEngine({
      play: [genieWonderfulTrickster],
    });

    const cardUnderTest = testEngine.getCardModel(genieWonderfulTrickster);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it.skip("YOUR REWARD AWAITS Whenever you play a card, draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: genieWonderfulTrickster.cost,
      play: [genieWonderfulTrickster],
      hand: [genieWonderfulTrickster],
    });

    await testEngine.playCard(genieWonderfulTrickster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("FORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: genieWonderfulTrickster.cost,
      play: [genieWonderfulTrickster],
      hand: [genieWonderfulTrickster],
    });

    await testEngine.playCard(genieWonderfulTrickster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
