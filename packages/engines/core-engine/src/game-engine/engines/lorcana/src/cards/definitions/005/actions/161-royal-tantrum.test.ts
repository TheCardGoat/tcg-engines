import { describe, expect, it } from "bun:test";
import { royalTantrum } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import {
  amberChromiconItem,
  halfHexwellCrown,
  healingDecanterItem,
  queensSensorCoreItem,
  retrosphere,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Royal Tantrum", () => {
  describe("Banish any number of your items, then draw a card for each item banished this way.", () => {
    it("Banishes just one item", () => {
      const testStore = new TestStore({
        deck: 10,
        inkwell: royalTantrum.cost,
        hand: [royalTantrum],
        play: [
          queensSensorCoreItem,
          amberChromiconItem,
          healingDecanterItem,
          retrosphere,
          halfHexwellCrown,
        ],
      });

      const cardUnderTest = testStore.getCard(royalTantrum);
      const target = testStore.getCard(healingDecanterItem);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("discard");
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 9, hand: 1, discard: 2 }),
      );
    });

    it("Banishing more than one, but not all", () => {
      const testStore = new TestStore({
        deck: 10,
        inkwell: royalTantrum.cost,
        hand: [royalTantrum],
        play: [
          queensSensorCoreItem,
          amberChromiconItem,
          healingDecanterItem,
          retrosphere,
          halfHexwellCrown,
        ],
      });

      const cardUnderTest = testStore.getCard(royalTantrum);
      const target = testStore.getCard(healingDecanterItem);
      const anotherTarget = testStore.getCard(queensSensorCoreItem);
      const yetAnotherTarget = testStore.getCard(amberChromiconItem);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({
        targets: [target, anotherTarget, yetAnotherTarget],
      });

      expect(target.zone).toBe("discard");
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 7, hand: 3, discard: 4 }),
      );
    });
  });
});
