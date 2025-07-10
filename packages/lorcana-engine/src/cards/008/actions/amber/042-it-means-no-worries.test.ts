/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { nalaFierceFriend } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { simbaAdventurousSuccessor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { mufasaAmongTheStars } from "@lorcanito/lorcana-engine/cards/007";
import { itMeansNoWorries } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("It Means No Worries", () => {
  it("Return up to 3 character cards from your discard to your hand.", async () => {
    const discardCards = [
      simbaAdventurousSuccessor,
      nalaFierceFriend,
      mufasaAmongTheStars,
    ];
    const testEngine = new TestEngine({
      inkwell: itMeansNoWorries.cost,
      hand: [itMeansNoWorries],
      discard: discardCards,
    });

    await testEngine.playCard(itMeansNoWorries, {
      targets: discardCards,
    });

    for (const card of discardCards) {
      expect(testEngine.getCardModel(card).zone).toEqual("hand");
    }
  });

  it(" You pay 2 {I} less for the next character you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: itMeansNoWorries.cost,
      hand: [itMeansNoWorries, simbaProtectiveCub],
    });

    expect(testEngine.getCardModel(simbaProtectiveCub).cost).toEqual(2);

    await testEngine.playCard(itMeansNoWorries);

    expect(testEngine.getCardModel(simbaProtectiveCub).cost).toEqual(0);
  });
});
