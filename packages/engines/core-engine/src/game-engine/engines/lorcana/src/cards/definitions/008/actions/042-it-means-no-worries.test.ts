import { describe, expect, it } from "bun:test";
import { simbaProtectiveCub } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { nalaFierceFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { simbaAdventurousSuccessor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { mufasaAmongTheStars } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { itMeansNoWorries } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
