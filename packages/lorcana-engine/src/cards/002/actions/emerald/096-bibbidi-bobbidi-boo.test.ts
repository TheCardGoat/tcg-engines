/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuck,
  tamatoaDrabLittleCrab,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { bibbidiBobbidiBoo } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import {
  cheshireCatAlwaysGrinning,
  flynnRiderConfidentVagabond,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const greenCost2 = cheshireCatAlwaysGrinning;
const anotherGreenCost2 = tamatoaDrabLittleCrab;
const greenCost1 = flynnRiderConfidentVagabond;
const redCost2 = donaldDuck;

// TODO: I don't have a good idea on how to solve this effect
describe("Bibbidi Bobbidi Boo", () => {
  describe("Return chosen character of yours to your hand to play another character with the same cost or less for free.", () => {
    it("should be able to play a character with the same cost, and same color", () => {
      const testStore = new TestStore({
        inkwell: bibbidiBobbidiBoo.cost,
        hand: [bibbidiBobbidiBoo, greenCost2],
        play: [anotherGreenCost2],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        bibbidiBobbidiBoo.id,
      );
      const cardFromReturn = testStore.getByZoneAndId(
        "play",
        anotherGreenCost2.id,
      );
      const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);
      cardUnderTest.playFromHand();

      testStore.resolveTopOfStack({ targets: [cardFromReturn] }, true);
      expect(cardFromReturn.zone).toEqual("hand");

      testStore.resolveTopOfStack({ targets: [cardToPlay] });
      expect(cardToPlay.zone).toEqual("play");

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("should be able to play a character with the lower cost, and same color", () => {
      const testStore = new TestStore({
        inkwell: bibbidiBobbidiBoo.cost,
        hand: [bibbidiBobbidiBoo, greenCost1],
        play: [greenCost2],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        bibbidiBobbidiBoo.id,
      );
      const cardToReturn = testStore.getByZoneAndId("play", greenCost2.id);
      const cardToPlay = testStore.getByZoneAndId("hand", greenCost1.id);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
      expect(cardToReturn.zone).toEqual("hand");

      testStore.resolveTopOfStack({ targets: [cardToPlay] });
      expect(cardToPlay.zone).toEqual("play");

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it.skip("should NOT be able to play a character with a higher cost", () => {
      const testStore = new TestStore({
        inkwell: bibbidiBobbidiBoo.cost,
        hand: [bibbidiBobbidiBoo, greenCost2],
        play: [greenCost1],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        bibbidiBobbidiBoo.id,
      );
      const cardToReturn = testStore.getByZoneAndId("play", greenCost1.id);
      const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
      expect(cardToReturn.zone).toEqual("hand");

      testStore.resolveTopOfStack({ targets: [cardToPlay] });
      expect(cardToPlay.zone).toEqual("hand");

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it.skip("should NOT be able to play a character with a different color and same cost", () => {
      const testStore = new TestStore({
        inkwell: bibbidiBobbidiBoo.cost,
        hand: [bibbidiBobbidiBoo, greenCost2],
        play: [redCost2],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        bibbidiBobbidiBoo.id,
      );
      const cardToReturn = testStore.getByZoneAndId("play", redCost2.id);
      const cardToPlay = testStore.getByZoneAndId("hand", greenCost2.id);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardToReturn] }, true);
      expect(cardToReturn.zone).toEqual("hand");

      testStore.resolveTopOfStack({ targets: [cardToPlay] });
      expect(cardToPlay.zone).toEqual("hand");

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it.skip("should NOT be able to play again the same character", () => {
      const testStore = new TestStore({
        inkwell: bibbidiBobbidiBoo.cost,
        hand: [bibbidiBobbidiBoo, greenCost1],
        play: [greenCost2],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        bibbidiBobbidiBoo.id,
      );
      const target = testStore.getByZoneAndId("play", greenCost2.id);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] }, true);
      expect(target.zone).toEqual("hand");

      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.zone).toEqual("hand");

      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
