/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  madamMimAsRhinoceros,
  madamMimUpToNoGood,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Madam Mim - As Rhinoceros", () => {
  it("SHIFT 2 (You can pay 2 {I} to play this character on one of your Madame Mime characters.)", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimAsRhinoceros.cost,
      hand: [madamMimAsRhinoceros],
      play: [madamMimUpToNoGood, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
    const target1 = testEngine.getCardModel(madamMimUpToNoGood);
    const target2 = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target1] }, true); // Shift onto Madam Mim
    await testEngine.resolveTopOfStack({ targets: [target2] }, true); // Return Dewey to hand

    expect(cardUnderTest.zone).toEqual("play");
    expect(target1.zone).toEqual("play");
    expect(target2.zone).toEqual("hand");
  });

  describe("MAKE WAY, I'M COMING! When you play this character, banish it or return one of your other characters in play to your hand.", () => {
    it("return another chosen character of yours to your hand.", async () => {
      const testEngine = new TestEngine({
        inkwell: madamMimAsRhinoceros.cost,
        hand: [madamMimAsRhinoceros],
        play: [deweyLovableShowoff],
      });

      const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
      const target = testEngine.getCardModel(deweyLovableShowoff);

      await testEngine.playCard(cardUnderTest);
      await testEngine.resolveTopOfStack({ skip: true }, true); // Skip shift effect
      await testEngine.resolveTopOfStack({ targets: [target] }, true); // Return Dewey to hand

      expect(target.zone).toEqual("hand");
    });

    it("skipping the effect banishes her.", async () => {
      const testEngine = new TestEngine({
        inkwell: madamMimAsRhinoceros.cost,
        hand: [madamMimAsRhinoceros],
        play: [deweyLovableShowoff],
      });

      const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
      const target = testEngine.getCardModel(deweyLovableShowoff);

      await testEngine.playCard(cardUnderTest);
      await testEngine.skipTopOfStack();

      expect(cardUnderTest.zone).toEqual("discard");
      expect(target.zone).toEqual("play");
    });
  });

  it("MAKE WAY, I'M COMING! When you play this character, banish it or return one of your other characters in play to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimAsRhinoceros.cost,
      hand: [madamMimAsRhinoceros],
    });

    const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);

    await testEngine.playCard(cardUnderTest);

    expect(cardUnderTest.zone).toEqual("discard");
  });
});
