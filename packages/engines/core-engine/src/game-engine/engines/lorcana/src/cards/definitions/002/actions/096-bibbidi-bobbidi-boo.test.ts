import { describe, expect, it } from "bun:test";
import {
  donaldDuck,
  tamatoaDrabLittleCrab,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { bibbidiBobbidiBoo } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  cheshireCatAlwaysGrinning,
  flynnRiderConfidentVagabond,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
