import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { quickShot } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Quick Shot", () => {
  it("Deal 1 damage to chosen character. Draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: quickShot.cost,
        hand: [quickShot],
        deck: 2,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    await testEngine.playCard(quickShot);
    await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
    expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 1,
        hand: 1,
      }),
    );
  });
});
