/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  geneNicelandResident,
  jasmineSteadyStrategist,
  ladyDecisiveDog,
  rhinoOnesixteenthWolf,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Steady Strategist", () => {
  it("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)", async () => {
    const testEngine = new TestEngine({
      play: [jasmineSteadyStrategist],
    });

    const cardUnderTest = testEngine.getCardModel(jasmineSteadyStrategist);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("ALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineSteadyStrategist.cost,
      play: [jasmineSteadyStrategist],
      deck: [geneNicelandResident, rhinoOnesixteenthWolf, ladyDecisiveDog],
    });
    const cardUnderTest = testEngine.getCardModel(jasmineSteadyStrategist);
    cardUnderTest.quest();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({
      scry: {
        hand: [rhinoOnesixteenthWolf],
        bottom: [geneNicelandResident, ladyDecisiveDog],
      },
    });
    expect(testEngine.getCardModel(rhinoOnesixteenthWolf).zone).toBe("hand");
    expect(testEngine.getCardModel(geneNicelandResident).zone).toBe("deck");
    expect(testEngine.getCardModel(ladyDecisiveDog).zone).toBe("deck");
  });
});
