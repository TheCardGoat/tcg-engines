import { describe, expect, it } from "bun:test";
import {
  kitCloudkickerToughGuy,
  mrSmeeBumblingMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kit Cloudkicker - Tough Guy", () => {
  it("**SKYSURFING** When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kitCloudkickerToughGuy.cost,
        hand: [kitCloudkickerToughGuy],
      },
      {
        play: [tipoGrowingSon],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
    const target = testEngine.getCardModel(tipoGrowingSon);
    cardUnderTest.playFromHand();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(testEngine.getCardZone(target)).toBe("hand");
  });

  it("regression check - cannot bounce targets with 3 attack or more", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kitCloudkickerToughGuy.cost,
        hand: [kitCloudkickerToughGuy],
      },
      {
        play: [mrSmeeBumblingMate],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
    cardUnderTest.playFromHand();

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
  });
});
