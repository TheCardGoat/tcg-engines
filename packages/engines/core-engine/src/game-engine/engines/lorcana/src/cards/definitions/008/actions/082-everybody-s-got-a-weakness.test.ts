import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  dalmatianPuppyTailWagger,
  deweyLovableShowoff,
  everybodysGotAWeakness,
  khanWarHorse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Everybody's Got A Weakness", () => {
  it("Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.", async () => {
    const charsInPlay = [
      deweyLovableShowoff,
      khanWarHorse,
      dalmatianPuppyTailWagger,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: everybodysGotAWeakness.cost,
        play: charsInPlay,
        hand: [everybodysGotAWeakness],
        deck: 10,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    for (const char of charsInPlay) {
      await testEngine.setCardDamage(char, 2);
    }

    await testEngine.playCard(everybodysGotAWeakness);

    await testEngine.resolveTopOfStack({
      targets: [goofyKnightForADay],
    });

    for (const char of charsInPlay) {
      expect(testEngine.getCardModel(char).damage).toEqual(1);
    }
    expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(
      charsInPlay.length,
    );
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: charsInPlay.length,
        deck: 10 - charsInPlay.length,
      }),
    );
  });
});
