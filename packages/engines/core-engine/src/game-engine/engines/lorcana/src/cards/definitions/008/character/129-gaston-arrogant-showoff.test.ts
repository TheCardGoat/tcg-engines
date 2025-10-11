import { describe, expect, it } from "bun:test";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import {
  deweyLovableShowoff,
  gastonArrogantShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gaston - Arrogant Showoff", () => {
  it("BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: gastonArrogantShowoff.cost,
      hand: [gastonArrogantShowoff],
      play: [deweyLovableShowoff, luckyDime],
    });

    const cardUnderTest = testEngine.getCardModel(gastonArrogantShowoff);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();

    await testEngine.resolveTopOfStack({ targets: [luckyDime] }, true);
    expect(testEngine.getCardModel(luckyDime).zone).toEqual("discard");

    await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
    expect(testEngine.getCardModel(deweyLovableShowoff).strength).toEqual(
      deweyLovableShowoff.strength + 2,
    );
  });
});
