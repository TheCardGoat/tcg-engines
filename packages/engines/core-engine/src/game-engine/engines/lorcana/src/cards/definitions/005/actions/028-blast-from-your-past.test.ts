import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { peterPansShadowNotSewnOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { peteBornToCheat } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { blastFromYourPast } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { petePastryChomper } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";

describe("Blast From Your Past", () => {
  it("Name a card. Return all character cards with that name from your discard to your hand.", () => {
    const testStore = new TestStore({
      inkwell: blastFromYourPast.cost,
      hand: [blastFromYourPast],
      discard: [petePastryChomper, peteBornToCheat, peterPansShadowNotSewnOn],
    });

    const cardUnderTest = testStore.getCard(blastFromYourPast);
    const targetOne = testStore.getCard(petePastryChomper);
    const targetTwo = testStore.getCard(peteBornToCheat);
    const targetThree = testStore.getCard(peterPansShadowNotSewnOn);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ nameACard: "Pete" });

    expect(targetOne.zone).toBe("hand");
    expect(targetTwo.zone).toBe("hand");
    expect(targetThree.zone).toBe("discard");
  });
});
