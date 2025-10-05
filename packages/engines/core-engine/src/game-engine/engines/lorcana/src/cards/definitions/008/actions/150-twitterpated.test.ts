import { describe, expect, it } from "bun:test";
import {
  patchPlayfulPup,
  twitterpated,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Twitterpated", () => {
  it("Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: twitterpated.cost,
      play: [patchPlayfulPup],
      hand: [twitterpated],
    });

    expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
    await testEngine.playCard(twitterpated);

    await testEngine.resolveTopOfStack({ targets: [patchPlayfulPup] });
    expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);

    // TODO: Test duration cleanup when turn-based duration system is implemented
    // testEngine.passTurn();
    // expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);
    // testEngine.passTurn();
    // expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
  });
});
