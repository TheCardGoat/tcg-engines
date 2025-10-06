/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  grandDukeAdvisorToTheKing,
  pigletVerySmallAnimal,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { bindingContract } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Binding Contract", () => {
  it("**FOR ALL ETERNITY** {E}, {E} one of your characters − Exert chosen character.", () => {
    const testEngine = new TestEngine(
      {
        play: [bindingContract, grandDukeAdvisorToTheKing],
      },
      {
        play: [pigletVerySmallAnimal],
      },
    );

    const cardUnderTest = testEngine.getCardModel(bindingContract);
    const cardToPayCost = testEngine.getCardModel(grandDukeAdvisorToTheKing);
    const target = testEngine.getCardModel(pigletVerySmallAnimal);

    expect(target.ready).toEqual(true);
    expect(cardToPayCost.ready).toEqual(true);

    testEngine.activateCard(cardUnderTest, {
      ability: "For All Eternity",
      costs: [cardToPayCost],
    });
    testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.ready).toEqual(false);
    expect(cardToPayCost.ready).toEqual(false);
  });
});
