/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bambiPrinceOfTheForest,
  deweyLovableShowoff,
  elsaFierceProtector,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa - Fierce Protector", () => {
  it("ICE OVER 1 {I}, Choose and discard a card – Exert chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 1,
        hand: [bambiPrinceOfTheForest],
        play: [elsaFierceProtector],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(elsaFierceProtector);
    const cardInHand = testEngine.getCardModel(bambiPrinceOfTheForest);
    const targetCard = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.activateCard(cardUnderTest, { costs: [cardInHand] });
    await testEngine.resolveTopOfStack({ targets: [targetCard] }, true);

    expect(targetCard.exerted).toBe(true);
  });
});
