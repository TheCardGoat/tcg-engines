import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { mosquitoBite } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mosquito Bite", () => {
  it("Put 1 damage counter on chosen character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mosquitoBite.cost,
        hand: [mosquitoBite],
        deck: 2,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    await testEngine.playCard(mosquitoBite);
    await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
    expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
  });
});
