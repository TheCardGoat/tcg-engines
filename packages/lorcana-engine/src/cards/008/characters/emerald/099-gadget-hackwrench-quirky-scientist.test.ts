/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  gadgetHackwrenchQuirkyScientist,
  louieOneCoolDuck,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Gadget Hackwrench - Quirky Scientist", () => {
  it("GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gadgetHackwrenchQuirkyScientist.cost,
        hand: [gadgetHackwrenchQuirkyScientist],
      },
      {
        hand: [deweyLovableShowoff, louieOneCoolDuck],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      gadgetHackwrenchQuirkyScientist,
    );

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });
  it("Start with 1 card player one e 1 card player 2", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gadgetHackwrenchQuirkyScientist.cost,
        hand: [gadgetHackwrenchQuirkyScientist],
      },
      {
        hand: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      gadgetHackwrenchQuirkyScientist,
    );

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });
  it("Don't Draw", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gadgetHackwrenchQuirkyScientist.cost,
        hand: [gadgetHackwrenchQuirkyScientist],
      },
      {
        hand: [],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      gadgetHackwrenchQuirkyScientist,
    );

    await testEngine.playCard(cardUnderTest);

    expect(testEngine.getCardsByZone("hand").length).toEqual(0);
  });
});
