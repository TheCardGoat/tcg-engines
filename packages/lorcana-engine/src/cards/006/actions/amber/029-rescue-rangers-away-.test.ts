/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielOnHumanLegs,
  liloMakingAWish,
  mauiDemiGod,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rescueRangersAway } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
