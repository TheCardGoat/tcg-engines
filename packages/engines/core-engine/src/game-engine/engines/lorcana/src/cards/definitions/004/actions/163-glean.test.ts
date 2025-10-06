import { describe, expect, it } from "bun:test";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { glean } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Glean", () => {
  it("Targeting your own card", async () => {
    const testEngine = new TestEngine({
      inkwell: glean.cost,
      hand: [glean],
      play: [pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(glean);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer()).toEqual(2);
  });

  it("Targeting opponent's card", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: glean.cost,
        hand: [glean],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testEngine.getCardModel(glean);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer("player_two")).toEqual(2);
  });
});
