import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { showTheWay } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe.skip("Show The Way", () => {
  it("Your characters get +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [showTheWay],
    });

    await testEngine.playCard(showTheWay);
    await testEngine.resolveTopOfStack({});

    expect(testEngine.getCardModel(mickeyBraveLittleTailor).strength).toBe(
      mickeyBraveLittleTailor.strength + 2,
    );
  });
});
