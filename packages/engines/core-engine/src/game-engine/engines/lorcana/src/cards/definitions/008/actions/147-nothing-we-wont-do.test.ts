import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  dalmatianPuppyTailWagger,
  deweyLovableShowoff,
  khanWarHorse,
  nothingWeWontDo,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nothing We Won't Do", () => {
  it("Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.", async () => {
    const charsInPlay = [
      deweyLovableShowoff,
      khanWarHorse,
      dalmatianPuppyTailWagger,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: nothingWeWontDo.cost,
        play: charsInPlay,
        hand: [nothingWeWontDo],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    // Exert all characters
    for (const char of charsInPlay) {
      await testEngine.exertCard(char);
    }

    // Verify they are exerted before playing the card
    for (const char of charsInPlay) {
      expect(testEngine.getCardModel(char).meta.exerted).toEqual(true);
      expect(testEngine.getCardModel(char).hasQuestRestriction).toEqual(false);
    }

    // Play the action card
    await testEngine.playCard(nothingWeWontDo);

    // Verify all characters are readied and have quest restriction
    for (const char of charsInPlay) {
      const charModel = testEngine.getCardModel(char);

      expect(charModel.meta.exerted).toEqual(false);
      expect(charModel.hasQuestRestriction).toEqual(true);

      // Challenge with each character to verify damage immunity
      await testEngine.challenge({
        attacker: char,
        defender: goofyKnightForADay,
      });

      // Verify character took no damage and is still in play
      expect(charModel.zone).toEqual("play");
      expect(charModel.damage).toEqual(0);
    }
  });
});
