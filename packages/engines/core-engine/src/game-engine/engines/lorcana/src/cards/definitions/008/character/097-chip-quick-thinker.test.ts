import { describe, expect, it } from "bun:test";
import {
  chipQuickThinker,
  daleBumbler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chip - Quick Thinker", () => {
  it("I'LL HANDLE IT When you play this character, choose an opponent to discard a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: chipQuickThinker.cost,
        hand: [chipQuickThinker],
      },
      {
        hand: [daleBumbler],
      },
    );

    await testEngine.playCard(chipQuickThinker);
    await testEngine.changeActivePlayer();
    testEngine.resolveTopOfStack({ targets: [daleBumbler] });

    expect(testEngine.getCardModel(daleBumbler).zone).toEqual("discard");
  });
});
