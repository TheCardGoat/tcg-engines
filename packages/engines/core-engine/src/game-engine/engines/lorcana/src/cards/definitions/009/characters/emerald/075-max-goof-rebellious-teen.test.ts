import { describe, expect, it } from "bun:test";
import { trialsAndTribulations } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import {
  maxGoofRebelliousTeen,
  motherKnowsBest,
} from "./075-max-goof-rebellious-teen";

describe("Max Goof - Rebellious Teen", () => {
  it("PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: maxGoofRebelliousTeen.cost + 1,
      hand: [maxGoofRebelliousTeen],
      discard: [trialsAndTribulations],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofRebelliousTeen);
    const cardTarget = testEngine.getCardModel(trialsAndTribulations);

    expect(cardTarget.zone).toBe("discard");

    await testEngine.playCard(cardUnderTest);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [cardTarget] });

    expect(cardTarget.zone).toBe("hand");
  });
});

describe("Regression Test", () => {
  it("Interaction with Mother Knows Best", async () => {
    const testEngine = new TestEngine({
      inkwell: maxGoofRebelliousTeen.cost + 1,
      hand: [maxGoofRebelliousTeen],
      discard: [motherKnowsBest],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofRebelliousTeen);
    const cardTarget = testEngine.getCardModel(motherKnowsBest);

    expect(cardTarget.zone).toBe("discard");

    await testEngine.playCard(cardUnderTest);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [cardTarget] });

    expect(cardTarget.zone).toBe("hand");
  });
});
