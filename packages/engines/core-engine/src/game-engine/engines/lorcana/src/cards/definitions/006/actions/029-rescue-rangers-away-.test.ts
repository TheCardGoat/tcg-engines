import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  arielOnHumanLegs,
  liloMakingAWish,
  mauiDemiGod,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { rescueRangersAway } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rescue Rangers Away!", () => {
  it("Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: rescueRangersAway.cost,
      hand: [rescueRangersAway],
      play: [liloMakingAWish, stichtNewDog, arielOnHumanLegs, mauiDemiGod],
    });

    const cardUnderTest = testEngine.getCardModel(rescueRangersAway);
    const target = testEngine.getCardModel(mauiDemiGod);

    await testEngine.playCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(mauiDemiGod.strength - 4);
  });
  it("Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn. (zero case)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rescueRangersAway.cost,
        hand: [rescueRangersAway],
      },
      {
        play: [liloMakingAWish, stichtNewDog, arielOnHumanLegs, mauiDemiGod],
      },
    );

    const cardUnderTest = testEngine.getCardModel(rescueRangersAway);
    const target = testEngine.getCardModel(mauiDemiGod);

    await testEngine.playCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(mauiDemiGod.strength);
  });
});
